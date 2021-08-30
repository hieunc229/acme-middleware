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
exports.renewCertWithWildcardHandler = void 0;
const certificate_1 = __importDefault(require("../certificate/certificate"));
const createCertHandler_1 = require("./createCertHandler");
const store_1 = __importDefault(require("../store"));
function renewCertWithWildcardHandler(req, res) {
    handler(req, res);
}
exports.renewCertWithWildcardHandler = renewCertWithWildcardHandler;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const domain = req.query.domain || req.hostname;
        const exists = certificate_1.default.exists(domain, `key.pem`);
        if (exists) {
            const store = store_1.default.getStore();
            if (req.query.clear === "true") {
                yield store.remove("challenge", domain);
            }
            if (req.query.confirm === "true") {
                yield certificate_1.default.remove(domain);
            }
        }
        req.skipChecking = true;
        createCertHandler_1.createCertWithWildcardHandler(req, res);
    });
}
