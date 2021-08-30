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
exports.createDNS = void 0;
const DNSClient_1 = __importDefault(require("../store/DNSClient"));
function createDNS(challenge, keyAuthorization) {
    return __awaiter(this, void 0, void 0, function* () {
        let dnsRecord;
        const dnsClient = DNSClient_1.default.get();
        if (dnsClient) {
            let request = yield dnsClient.createRecord(challenge.dnsChallengeRecord, "TXT", keyAuthorization);
            dnsRecord = request.result;
        }
        return dnsRecord;
    });
}
exports.createDNS = createDNS;
