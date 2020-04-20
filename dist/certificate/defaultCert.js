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
const fs_1 = __importDefault(require("fs"));
const acme_client_1 = __importDefault(require("acme-client"));
function checkDefaultCert(certhPath, keyPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(certhPath) || !fs_1.default.existsSync(keyPath)) {
            // generate an RSA key pair synchronously
            // *NOT RECOMMENDED*: Can be significantly slower than async and may block
            // JavaScript execution. Will use native Node.js 10.12.0+ API if possible.
            const privateKey = yield acme_client_1.default.forge.createPrivateKey();
            const publicKey = acme_client_1.default.forge.createPublicKey(privateKey);
            const [certificateKey, certificateCsr] = yield acme_client_1.default.openssl.createCsr({
                commonName: 'localhost',
                altNames: ['localhost']
            });
            fs_1.default.writeFileSync("./generatedPrivateKey.pem", privateKey);
            fs_1.default.writeFileSync(certhPath, certificateKey);
            fs_1.default.writeFileSync(keyPath, publicKey);
        }
    });
}
exports.checkDefaultCert = checkDefaultCert;
