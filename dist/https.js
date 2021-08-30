"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const tls_1 = __importDefault(require("tls"));
const pathUtils_1 = __importDefault(require("./pathUtils"));
const loadCert_1 = require("./certificate/loadCert");
const defaultCert_1 = require("./certificate/defaultCert");
const localCertPath = pathUtils_1.default("default/cert.pem");
const localKeyPath = pathUtils_1.default("default/key.pem");
function createSSLServer(app) {
    defaultCert_1.checkDefaultCert(localCertPath, localKeyPath);
    const server = https_1.default.createServer({
        SNICallback: (servername, cb) => {
            if (servername === "localhost") {
                localCertCB(cb);
                return;
            }
            loadCert_1.loadCert(servername)
                .then(ctx => {
                cb(null, ctx);
            })
                .catch(err => {
                console.log("[err SNICallback]", servername);
                localCertCB(cb);
            });
        },
        sessionTimeout: 15000
    }, app);
    return server;
}
exports.default = createSSLServer;
function localCertCB(cb) {
    cb(null, tls_1.default.createSecureContext({
        cert: localCertPath,
        key: localKeyPath
    }));
}
