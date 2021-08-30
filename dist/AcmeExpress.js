"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcmeExpress = exports.ACME_PATH = void 0;
const express_1 = __importDefault(require("express"));
const store_1 = __importDefault(require("./store"));
const pathUtils_1 = __importDefault(require("./pathUtils"));
const https_1 = __importDefault(require("./https"));
const DNSClient_1 = __importDefault(require("./store/DNSClient"));
const cert_store_1 = __importDefault(require("./modules/cert-store"));
const utils_1 = require("./utils");
const createCertHandler_1 = require("./handlers/createCertHandler");
const renewCertHandler_1 = require("./handlers/renewCertHandler");
const processCertHandler_1 = require("./handlers/processCertHandler");
const infoCertHandler_1 = require("./handlers/infoCertHandler");
const listExpiredDomainHandler_1 = require("./handlers/listExpiredDomainHandler");
const startup_1 = require("./functions/startup");
const createCertAutoHandler_1 = require("./handlers/createCertAutoHandler");
const orderInfoHandler_1 = require("./handlers/orderInfoHandler");
const utils_2 = require("./certificate/utils");
exports.ACME_PATH = "/___acme";
class AcmeExpress {
    constructor(props) {
        this.initiate = () => {
            utils_1.dirCheckup();
            this.app.use('/.well-known/acme-challenge', express_1.default.static(pathUtils_1.default('acme-challenge')));
            // Create a new certificate
            this.app.get(`${exports.ACME_PATH}/wildcard/create`, createCertHandler_1.createCertWithWildcardHandler);
            // Renew an existing certificate
            // The only different with /create is 
            // /renew will check and remove exsiting record
            this.app.get(`${exports.ACME_PATH}/wildcard/renew`, renewCertHandler_1.renewCertWithWildcardHandler);
            // Get existing info
            this.app.get(`${exports.ACME_PATH}/wildcard/info`, infoCertHandler_1.infoCertWithWildcardHandler);
            // Start validate and generate certificate
            this.app.get(`${exports.ACME_PATH}/wildcard/process`, processCertHandler_1.processCertWithWildcardHandler);
            // Start validate and generate certificate
            this.app.get(`${exports.ACME_PATH}/wildcard/order`, orderInfoHandler_1.orderInfoHandler);
            // Start validate and generate certificate
            this.app.get(`${exports.ACME_PATH}/cert/create`, createCertAutoHandler_1.createCertAutoHandler);
            if (process.env.ACME_EXPRESS_PRODUCTION !== "true" || process.env.ACME_EXPRESS_ENABLE_EXPIRE_LIST === "true") {
                // Start validate and generate certificate
                this.app.get(`${exports.ACME_PATH}/expire`, listExpiredDomainHandler_1.listExpiredDomainHandler);
            }
        };
        this.app = props.app;
        this.https = https_1.default(props.app);
        const store = new cert_store_1.default(props.dbPath || pathUtils_1.default("acme.db"));
        store_1.default.setStore(store);
        props.dnsClient && DNSClient_1.default.set(props.dnsClient);
        utils_2.log(`==== [ACME] 
            production:${process.env.ACME_EXPRESS_PRODUCTION},
            dbPath:${!!props.dbPath}, 
            dnsClient:${!!props.dnsClient}, 
            path:${process.env.ACME_EXPRESS_PATH}
        `);
        this.initiate();
        startup_1.startup();
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
            http: this.app.listen(port, host, () => fn && fn({ host, port, httpsPort })),
            // @ts-ignore
            https: this.https.listen(httpsPort, host, () => fn && fn({ host, port: httpsPort }))
        };
    }
}
exports.AcmeExpress = AcmeExpress;
