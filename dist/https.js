"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const tls_1 = __importDefault(require("tls"));
const fs_1 = __importDefault(require("fs"));
const loadCert_1 = require("./certificate/loadCert");
// import { checkDefaultCert } from './certificate/defaultCert';
const localCertPath = process.env.ACME_EXPRESS_LOCAL_CERT || "/acme-express/certs/default/cert.pem";
const localKeyPath = process.env.ACME_EXPRESS_LOCAL_KEY || "/acme-express/certs/default/key.pem";
function createSSLServer(app) {
    // checkDefaultCert(localCertPath, localKeyPath);
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
        cert: fs_1.default.readFileSync(localCertPath, 'utf8'),
        key: fs_1.default.readFileSync(localKeyPath, 'utf8')
    }));
}
