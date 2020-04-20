"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("./https"));
const pathUtils_1 = __importDefault(require("./pathUtils"));
class AcmeExpress {
    constructor(app) {
        this.initate = () => {
            this.app.use('/.well-known/acme-challenge', express_1.default.static(pathUtils_1.default('acme-challenge')));
        };
        this.app = app;
        this.https = https_1.default(app);
        this.initate();
    }
    getApp() {
        return this.app;
    }
    listen(opts, callback) {
        let { host, port } = Object.assign({ host: 'localhost', port: 80 }, opts);
        let fn = (typeof opts === "function" ? opts : callback);
        return {
            // @ts-ignore
            http: this.app.listen(port, host, () => fn && fn({ host, port })),
            // @ts-ignore
            https: this.https.listen(443, host, () => fn && fn({ host, port: 443 }))
        };
    }
}
exports.AcmeExpress = AcmeExpress;
