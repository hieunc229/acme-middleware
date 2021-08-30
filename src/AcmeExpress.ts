import https from "https";
import express, { Express } from "express";

import CertStore from "./store";
import getAcmePath from "./pathUtils";
import createSSLServer from "./https";
import KnexCertStore from "./modules/cert-store";

import DNSClient, { AcmeDNSClientAbstract } from "./store/DNSClient";

import { dirCheckup } from "./utils";
import { infoCertWithWildcardHandler } from "./handlers/infoCertHandler";
import { renewCertWithWildcardHandler } from "./handlers/renewCertHandler";
import { createCertWithWildcardHandler } from "./handlers/createCertHandler";
import { processCertWithWildcardHandler } from "./handlers/processCertHandler";

import { log } from "./certificate/utils";
import { startup } from "./functions/startup";
import { authHandler } from "handlers/authHandler";
import { orderInfoHandler } from "./handlers/orderInfoHandler";
import { renewCertAutoHandler } from "handlers/autoRenewCertHandler";
import { createCertAutoHandler } from "./handlers/autoCreateCertHandler";
import { listExpiredDomainHandler } from "./handlers/listExpiredDomainHandler";

export const ACME_PATH = "/___acme";

export class AcmeExpress {

    private app: Express;
    private https: https.Server;

    constructor(props: {
        app: any,
        dbPath?: string,
        dnsClient?: AcmeDNSClientAbstract
    }) {

        this.app = props.app;
        this.https = createSSLServer(props.app);

        const store = new KnexCertStore(props.dbPath || getAcmePath("acme.db"));
        CertStore.setStore(store);

        props.dnsClient && DNSClient.set(props.dnsClient);

        log(`==== [ACME] 
            production:${process.env.ACME_EXPRESS_PRODUCTION},
            dbPath:${!!props.dbPath}, 
            dnsClient:${!!props.dnsClient}, 
            path:${process.env.ACME_EXPRESS_PATH}
        `)

        this.initiate();
        startup();
    }

    private initiate = () => {

        dirCheckup();

        this.app.use(
            '/.well-known/acme-challenge',
            express.static(getAcmePath('acme-challenge'))
        );

        this.app.use(ACME_PATH, authHandler)

        // Create a certficate
        this.app.get(`${ACME_PATH}/cert/create`, createCertAutoHandler);

        // Renew an existing certificate
        this.app.get(`${ACME_PATH}/cert/renew`, renewCertAutoHandler);

        // Create a new certificate
        this.app.get(`${ACME_PATH}/wildcard/create`, createCertWithWildcardHandler);

        // Renew an existing certificate
        // The only different with /create is 
        // /renew will check and remove exsiting record
        this.app.get(`${ACME_PATH}/wildcard/renew`, renewCertWithWildcardHandler);

        // Get existing info
        this.app.get(`${ACME_PATH}/wildcard/info`, infoCertWithWildcardHandler);

        // Start validate and request certificate
        this.app.get(`${ACME_PATH}/wildcard/process`, processCertWithWildcardHandler);

        // Get request order object
        this.app.get(`${ACME_PATH}/wildcard/order`, orderInfoHandler);

        if (process.env.ACME_EXPRESS_PRODUCTION !== "true" || process.env.ACME_EXPRESS_ENABLE_EXPIRE_LIST  === "true") {
            // Start validate and generate certificate
            this.app.get(`${ACME_PATH}/expire`, listExpiredDomainHandler);
        }
    }

    getApp() {
        return this.app;
    }

    /**
     * Start the server
     * @param opts 
     * @param callback 
     */
    listen(opts?: {
        host?: string,
        port?: number,
        httpsPort?: number
    } | Function, callback?: (server: Express | https.Server) => void) {

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