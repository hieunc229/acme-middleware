"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const loadCert_1 = require("./certificate/loadCert");
const email = process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";
function createSSLServer(app) {
    const server = https_1.default.createServer({
        SNICallback: (servername, cb) => {
            loadCert_1.loadCert(servername, email)
                .then(ctx => {
                cb(null, ctx);
            });
        },
        sessionTimeout: 15000
    }, app);
    return server;
}
exports.default = createSSLServer;
