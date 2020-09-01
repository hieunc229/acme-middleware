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
exports.createCertWithWildcardHandler = void 0;
const certificate_1 = __importDefault(require("../certificate/certificate"));
const createCert_1 = __importDefault(require("../certificate/createCert"));
function createCertWithWildcardHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let domain = req.query.domain || req.hostname;
        const exists = certificate_1.default.exists(domain, `key.pem`);
        if (!exists && !req.query.force) {
            let challenges = yield createCert_1.default({
                domain,
                altNames: [`*.${domain}`],
                challengeOnly: !req.query.process
            });
            challenges ? res.status(200).json({
                status: 'pending',
                type: 'txt-record',
                value: `_acme-challenge.${domain}`,
                info: challenges
            }) : res.status(500).json({
                status: 'error',
                message: 'Unable to process. Please conact admin'
            });
            return;
        }
        res.status(409).json({
            status: 'already_exists'
        });
    });
}
exports.createCertWithWildcardHandler = createCertWithWildcardHandler;
