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
const tls_1 = __importDefault(require("tls"));
const createCert_1 = __importDefault(require("./createCert"));
const certificate_1 = __importDefault(require("./certificate"));
function loadCert(domain, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = certificate_1.default.exists(domain, `key.pem`);
        if (!exists) {
            yield createCert_1.default({ domain, email });
        }
        return tls_1.default.createSecureContext({
            key: certificate_1.default.load(domain, `key.pem`),
            cert: certificate_1.default.load(domain, `cert.pem`)
        });
    });
}
exports.loadCert = loadCert;
