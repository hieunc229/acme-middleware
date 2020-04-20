"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const tls_1 = __importDefault(require("tls"));
const loadCert_1 = require("./certificate/loadCert");
const localCertPath = process.env.ACME_EXPRESS_LOCAL_CERT || "/acme-express/certs/default/cert.pem";
const localKeyPath = process.env.ACME_EXPRESS_LOCAL_KEY || "/acme-express/certs/default/key.pem";
const email = process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
function createSSLServer(app) {
    // checkDefaultCert(localCertPath, localKeyPath);
    const server = https_1.default.createServer({
        SNICallback: (servername, cb) => {
            if (servername === "localhost") {
                localCertCB(cb);
                return;
            }
            loadCert_1.loadCert(servername, email)
                .then(ctx => {
                cb(null, ctx);
            })
                .catch(err => {
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
