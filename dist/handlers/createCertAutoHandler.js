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
exports.createCertAutoHandler = void 0;
const certificate_1 = __importDefault(require("../certificate/certificate"));
const createAuto_1 = require("../functions/createAuto");
function createCertAutoHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const domain = req.query.domain || req.hostname;
        if ("nocheck" in req.query === false) {
            const exists = certificate_1.default.exists(domain, `key.pem`);
            if (exists) {
                return res.status(409).json({
                    status: 'failed',
                    message: "Certificate already exists"
                });
            }
        }
        createAuto_1.createCertAuto({ domain })
            .then(() => {
            res.status(200).json({
                status: 'ok'
            });
        }).catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.toString()
            });
        });
    });
}
exports.createCertAutoHandler = createCertAutoHandler;
