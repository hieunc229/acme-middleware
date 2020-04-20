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
Object.defineProperty(exports, "__esModule", { value: true });
const challengeUtils_1 = require("./challengeUtils");
/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */
function challengeCreateFn(authz, challenge, keyAuthorization) {
    return __awaiter(this, void 0, void 0, function* () {
        return challengeUtils_1.createChallenge(challenge.token, keyAuthorization);
    });
}
exports.challengeCreateFn = challengeCreateFn;
/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */
function challengeRemoveFn(authz, challenge, keyAuthorization) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Do something here */
        // log(JSON.stringify(authz));
        // log(JSON.stringify(challenge));
        // log(keyAuthorization);
        // console.log("remove", challenge.token);
        return challengeUtils_1.removeChallenge(challenge.token);
    });
}
exports.challengeRemoveFn = challengeRemoveFn;
function log(m, ...args) {
    process.stdout.write(`${m}\n`);
    // console.log(arguments)}
}
exports.log = log;
