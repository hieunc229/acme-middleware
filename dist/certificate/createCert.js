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
const acme_client_1 = __importDefault(require("acme-client"));
const certificate_1 = __importDefault(require("./certificate"));
const store_1 = __importDefault(require("../store"));
const account_1 = require("./account");
const utils_1 = require("./utils");
const utils_2 = require("../store/utils");
function createCert(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let { domain, altNames, challengeOnly } = opts;
        let email = opts.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
        const client = yield account_1.getClient(email);
        let identifiers = [{ type: 'dns', value: domain }];
        altNames && (identifiers = identifiers.concat(altNames.map(value => {
            return { type: 'dns', value };
        })));
        /* Place new order */
        const order = yield client.createOrder({ identifiers });
        /**
        * authorizations / client.getAuthorizations(order);
        * An array with one item per DNS name in the certificate order.
        * All items require at least one satisfied challenge before order can be completed.
        */
        const authorizations = yield client.getAuthorizations(order);
        if (challengeOnly) {
            let challenges = [];
            authorizations.forEach(auth => {
                if (auth.status === "pending") {
                    challenges = challenges.concat(auth.challenges);
                }
            });
            yield challenges.forEach((item, i) => __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore
                challenges[i].keyAuthorization = yield client.getChallengeKeyAuthorization(item);
            }));
            return { challenges };
        }
        const promises = authorizations.map((authz) => __awaiter(this, void 0, void 0, function* () {
            /**
             * challenges / authz.challenges
             * An array of all available challenge types for a single DNS name.
             * One of these challenges needs to be satisfied.
             */
            const { challenges } = authz;
            /* Just select any challenge */
            const challenge = challenges.shift();
            const keyAuthorization = yield client.getChallengeKeyAuthorization(challenge);
            // log("keyAuthorization", keyAuthorization);
            try {
                /* Satisfy challenge */
                yield utils_1.challengeCreateFn(authz, challenge, keyAuthorization);
                /* Verify that challenge is satisfied */
                yield client.verifyChallenge(authz, challenge);
                /* Notify ACME provider that challenge is satisfied */
                yield client.completeChallenge(challenge);
                /* Wait for ACME provider to respond with valid status */
                yield client.waitForValidStatus(challenge);
            }
            finally {
                /* Clean up challenge response */
                try {
                    yield utils_1.challengeRemoveFn(authz, challenge, keyAuthorization);
                }
                catch (e) {
                    /**
                     * Catch errors thrown by challengeRemoveFn() so the order can
                     * be finalized, even though something went wrong during cleanup
                     */
                }
            }
        }));
        /* Wait for challenges to complete */
        yield Promise.all(promises);
        /* Finalize order */
        const [key, csr] = yield acme_client_1.default.forge.createCsr({
            commonName: domain,
            altNames: altNames
        });
        yield client.finalizeOrder(order, csr);
        const cert = yield client.getCertificate(order);
        yield certificate_1.default.save(domain, `key.pem`, key);
        yield certificate_1.default.save(domain, `cert.pem`, cert);
        yield store_1.default.getStore().insert(domain, utils_2.getFutureDate(90).getTime());
    });
}
exports.default = createCert;
