"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcmeExpress = void 0;
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("./https"));
const pathUtils_1 = __importDefault(require("./pathUtils"));
const createCertHandler_1 = require("./handlers/createCertHandler");
const utils_1 = require("./utils");
const store_1 = __importDefault(require("./store"));
class AcmeExpress {
    constructor(props) {
        this.initate = () => {
            utils_1.dirCheckup();
            this.app.use('/.well-known/acme-challenge', express_1.default.static(pathUtils_1.default('acme-challenge')));
            // Use `/_init-cert-wildcard` to request challenges
            // Use /_init-cert-wildcard?process=true to submit
            // Use /_init-cert-wildcard?force=true to create or replace
            this.app.get("/_init-cert-wildcard", createCertHandler_1.createCertWithWildcardHandler);
        };
        this.app = props.app;
        this.https = https_1.default(props.app);
        props.store && (store_1.default.setStore(props.store));
        this.initate();
    }
    getApp() {
        return this.app;
    }
    /**
     * Start the server
     * @param opts
     * @param callback
     */
    listen(opts, callback) {
        let { host, port, httpsPort } = Object.assign({ host: 'localhost', port: 80, httpsPort: 443 }, opts);
        let fn = (typeof opts === "function" ? opts : callback);
        return {
            // @ts-ignore
            http: this.app.listen(port, host, () => fn && fn({ host, port: httpPort })),
            // @ts-ignore
            https: this.https.listen(httpsPort, host, () => fn && fn({ host, port: httpsPort }))
        };
    }
}
exports.AcmeExpress = AcmeExpress;
