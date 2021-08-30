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
exports.checkDefaultCert = void 0;
const fs_1 = __importDefault(require("fs"));
const acme_client_1 = __importDefault(require("acme-client"));
const certificate_1 = __importDefault(require("./certificate"));
function checkDefaultCert(certhPath, keyPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(certhPath) || !fs_1.default.existsSync(keyPath)) {
            // https://github.com/publishlab/node-acme-client/blob/master/docs/forge.md#createCsr
            const privateKey = yield acme_client_1.default.forge.createPrivateKey();
            const publicKey = yield acme_client_1.default.forge.createPublicKey(privateKey);
            const [_, certificateCsr] = yield acme_client_1.default.forge.createCsr({
                commonName: 'localhost',
                altNames: ['localhost']
            }, privateKey);
            yield certificate_1.default.save("default", `key.pem`, publicKey);
            yield certificate_1.default.save('default', `cert.pem`, certificateCsr);
            yield certificate_1.default.save('default', `generatedPrivateKey.pem`, privateKey);
            // fs.writeFileSync(getAcmePath("./generatedPrivateKey.pem"), privateKey);
            // fs.writeFileSync(certhPath, certificateCsr);
            // fs.writeFileSync(keyPath, publicKey);
        }
    });
}
exports.checkDefaultCert = checkDefaultCert;
