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
exports.createChallenge = void 0;
const store_1 = __importDefault(require("../store"));
const client_1 = require("../certificate/client");
const process_1 = require("./process");
const utils_1 = require("./utils");
const createDNS_1 = require("./createDNS");
function createChallenge(props) {
    return __awaiter(this, void 0, void 0, function* () {
        let { domain, altNames } = props;
        let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
        const client = yield client_1.getClient(email);
        let identifiers = utils_1.getAuthIdentifiers(domain, altNames);
        /* Place new order */
        const order = yield client.createOrder({ identifiers });
        const authorizations = yield client.getAuthorizations(order);
        let challenge;
        let authz;
        let allValid = true;
        authorizations.some(auth => {
            if (auth.status !== "valid") {
                allValid = false;
            }
            if (auth.status === "pending") {
                let dnsChallange = auth.challenges.find(item => item.type === "dns-01");
                if (dnsChallange) {
                    authz = auth;
                    challenge = {
                        url: auth.url,
                        expires: auth.expires,
                        wildcard: auth.wildcard,
                        identifier: auth.identifier,
                        status: auth.status,
                        dnsChallange: dnsChallange,
                        dnsChallengeRecord: `_acme-challenge.${auth.identifier.value}`,
                        challenges: auth.challenges,
                        keyAuthorization: ""
                    };
                }
            }
            return challenge;
        });
        if (!challenge) {
            if (allValid) {
                return Promise.reject(`${domain} has already requested a certificate`);
            }
            return Promise.reject("Unable to find dns-01 challange");
        }
        const keyAuthorization = yield client.getChallengeKeyAuthorization(challenge.dnsChallange);
        const dnsRecord = yield createDNS_1.createDNS(challenge, keyAuthorization);
        let store = store_1.default.getStore();
        let output = {
            dnsRecord,
            challenge: Object.assign(Object.assign({}, challenge), { keyAuthorization }),
            order: {
                url: order.url,
                identifiers: order.identifiers,
                finalize: order.finalize,
                authorizations: order.authorizations,
                status: order.status
            }
        };
        yield store.set("challenge", domain, output);
        if (challenge && authz) {
            yield process_1.processChallengeRW({
                challenge: challenge.dnsChallange,
                altNames,
                domain,
                client,
                order,
                auth: authz
            });
        }
        return output;
    });
}
exports.createChallenge = createChallenge;
