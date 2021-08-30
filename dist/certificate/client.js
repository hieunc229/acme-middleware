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
exports.getClient = void 0;
const acme_client_1 = __importDefault(require("acme-client"));
const fs_1 = __importDefault(require("fs"));
const pathUtils_1 = __importDefault(require("../pathUtils"));
let accountKey;
function getOrCreateKey() {
    return __awaiter(this, void 0, void 0, function* () {
        let created = false;
        if (accountKey) {
            return Promise.resolve([accountKey, created]);
        }
        const keyPath = pathUtils_1.default("accountKey.pem");
        if (!fs_1.default.existsSync(keyPath)) {
            let strBuff = yield acme_client_1.default.forge.createPrivateKey();
            fs_1.default.writeFileSync(keyPath, strBuff);
            accountKey = strBuff;
            created = false;
        }
        else {
            accountKey = fs_1.default.readFileSync(keyPath);
        }
        return [accountKey, created];
    });
}
function getClient(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const [accountKey, created] = yield getOrCreateKey();
        /* Init client */
        const client = new acme_client_1.default.Client({
            directoryUrl: process.env.ACME_EXPRESS_PRODUCTION === "true" ? acme_client_1.default.directory.letsencrypt.production : acme_client_1.default.directory.letsencrypt.staging,
            accountKey
        });
        if (!created) {
            /* Register account */
            yield client.createAccount({
                termsOfServiceAgreed: true,
                contact: [`mailto:${email}`]
            });
        }
        return client;
    });
}
exports.getClient = getClient;
