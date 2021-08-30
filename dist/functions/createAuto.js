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
exports.createCertAuto = void 0;
const acme_client_1 = __importDefault(require("acme-client"));
const store_1 = __importDefault(require("../store"));
const certificate_1 = __importDefault(require("../certificate/certificate"));
const client_1 = require("../certificate/client");
const utils_1 = require("../store/utils");
const utils_2 = require("../certificate/utils");
function createCertAuto(props) {
    return __awaiter(this, void 0, void 0, function* () {
        let { domain } = props;
        let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
        const client = yield client_1.getClient(email);
        const [key, csr] = yield acme_client_1.default.forge.createCsr({ commonName: domain });
        /* Certificate */
        const cert = yield client.auto({
            csr,
            email: email,
            termsOfServiceAgreed: true,
            challengeCreateFn: createChallange,
            challengeRemoveFn: removeChallange
        });
        yield certificate_1.default.save(domain, `key.pem`, key);
        yield certificate_1.default.save(domain, `cert.pem`, cert);
        const store = store_1.default.getStore();
        yield store.set("domains", domain, {
            expire: utils_1.getFutureDate(90).toJSON()
        });
        return [key.toString(), cert];
    });
}
exports.createCertAuto = createCertAuto;
/// https://github.com/publishlab/node-acme-client/blob/master/examples/auto.js
function createChallange(authz, challenge, keyAuthorization) {
    return __awaiter(this, void 0, void 0, function* () {
        utils_2.challengeCreateFn(challenge, keyAuthorization);
    });
}
function removeChallange(authz, challenge, keyAuthorization) {
    return __awaiter(this, void 0, void 0, function* () {
        utils_2.challengeRemoveFn(challenge);
    });
}
