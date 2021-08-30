"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDNS = void 0;
const dns_1 = __importDefault(require("dns"));
function verifyDNS(data) {
    return new Promise((resolve, reject) => {
        dns_1.default.resolveTxt(data.challenge.dnsChallengeRecord, (err, address) => {
            if (err) {
                return reject(err);
            }
            resolve({
                keyAuthorization: data.challenge.keyAuthorization,
                valid: address.flat().indexOf(data.challenge.keyAuthorization) !== -1,
                address
            });
        });
    });
}
exports.verifyDNS = verifyDNS;
