"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChallengeRW = void 0;
const acme_client_1 = __importDefault(require("acme-client"));
const store_1 = __importDefault(require("../store"));
const certificate_1 = __importDefault(require("../certificate/certificate"));
const DNSClient_1 = __importDefault(require("../store/DNSClient"));
const client_1 = require("../certificate/client");
const utils_1 = require("../store/utils");
const utils_2 = require("../certificate/utils");
const verify_1 = require("./verify");
const createDNS_1 = require("./createDNS");
function processChallenge(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let { domain, altNames } = opts;
        let email = opts.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
        const store = store_1.default.getStore();
        const client = yield client_1.getClient(email);
        const item = yield store.get("challenge", domain);
        let challenge = item.challenge.dnsChallange;
        const order = yield client.getOrder(item.order);
        const auths = yield client.getAuthorizations(order);
        if (auths.length === 0) {
            return Promise.reject(`Unable to get authorization`);
        }
        const authz = auths[0];
        return processChallengeRW({
            order: order,
            client,
            challenge,
            domain,
            altNames,
            auth: authz
        });
    });
}
exports.default = processChallenge;
function processChallengeRW(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (["valid", "ready"].indexOf(opts.order.status) === -1) {
            return Promise.reject(`Order status must be ready/valid. Current status ${opts.order.status}`);
        }
        const { domain, altNames } = opts;
        const store = store_1.default.getStore();
        const client = opts.client;
        const item = yield store.get("challenge", domain);
        const order = opts.order;
        const challenge = opts.challenge;
        const dnsValid = yield verify_1.verifyDNS(item);
        let dnsRecord = item.dnsRecord;
        if (!dnsValid.valid) {
            dnsRecord = yield createDNS_1.createDNS(item.challenge, item.challenge.keyAuthorization);
        }
        const verify = yield client.verifyChallenge(opts.auth, challenge);
        utils_2.log("verify", verify);
        /* Notify ACME provider that challenge is satisfied */
        const completed = yield client.completeChallenge(challenge);
        utils_2.log("completed", completed);
        if (completed.status !== "valid") {
            return Promise.reject(`Challange status must be valid. Current status ${completed.status}`);
        }
        /* Wait for ACME provider to respond with valid status */
        const statusChange = yield client.waitForValidStatus(challenge);
        utils_2.log("statusChange", statusChange);
        if (statusChange.status !== "valid") {
            return Promise.reject(`ACME verification status must be valid. Current status ${completed.status}`);
        }
        /* Finalize order */
        const [key, csr] = yield acme_client_1.default.forge.createCsr({
            commonName: domain,
            altNames: altNames
        });
        let finalizeOrder = yield client.finalizeOrder(order, csr);
        utils_2.log("finalizeOrder", finalizeOrder);
        if (["ready", "pending", "processing"].indexOf(order.status) !== -1) {
            return Promise.reject(`ACME verification status must be ready/valid. Current status ${finalizeOrder.status}`);
        }
        const cert = yield client.getCertificate(order);
        yield certificate_1.default.save(domain, `key.pem`, key);
        yield certificate_1.default.save(domain, `cert.pem`, cert);
        yield store.set("domains", domain, {
            expire: utils_1.getFutureDate(90).toJSON(),
            dnsRecord: dnsRecord,
            altNames
        });
        const dnsClient = DNSClient_1.default.get();
        if (dnsClient && dnsRecord) {
            yield dnsClient.removeRecord(dnsRecord.id);
        }
        yield store.remove("challenge", domain);
    });
}
exports.processChallengeRW = processChallengeRW;
