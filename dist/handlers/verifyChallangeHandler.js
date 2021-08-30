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
exports.verifyCertWithWildcardHandler = void 0;
const info_1 = __importDefault(require("../functions/info"));
const dns_1 = __importDefault(require("dns"));
function verifyCertWithWildcardHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const domain = req.query.domain || req.hostname;
        info_1.default({ domain })
            .then(data => {
            dns_1.default.resolveTxt(data.challenge.dnsChallengeRecord, (err, address) => {
                if (err) {
                    res.status(500).json({
                        status: 'error',
                        domain,
                        message: err.toString()
                    });
                }
                res.status(200).json({
                    status: 'ok',
                    data: {
                        keyAuthorization: data.challenge.keyAuthorization,
                        valid: address.flat().indexOf(data.challenge.keyAuthorization) !== -1,
                        address
                    }
                });
            });
        })
            .catch(err => {
            res.status(500).json({
                status: 'error',
                domain,
                message: err.toString()
            });
        });
    });
}
exports.verifyCertWithWildcardHandler = verifyCertWithWildcardHandler;
