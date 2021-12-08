import https from "https";
import express, { Express } from "express";

import CertStore from "./store";
import getAcmePath from "./pathUtils";
import createSSLServer from "./https";
import KnexCertStore from "./modules/cert-store";

import DNSClient, { AcmeDNSClientAbstract } from "./store/DNSClient";

import { dirCheckup } from "./utils";
import { infoCertWithWildcardHandler } from "./handlers/wildcardRequestInfoCertHandler";
import { renewCertWithWildcardHandler } from "./handlers/wildcardRenewCertHandler";
import { createCertWithWildcardHandler } from "./handlers/wildcardCreateCertHandler";
import { processCertWithWildcardHandler } from "./handlers/wildcardProcessCertHandler";

import { log } from "./certificate/utils";
import { startup } from "./functions/startup";
import { authHandler } from "./handlers/authHandler";
import { orderInfoHandler } from "./handlers/wildcardOrderInfoHandler";
import { renewCertAutoHandler } from "./handlers/autoRenewCertHandler";
import { createCertAutoHandler } from "./handlers/autoCreateCertHandler";
import { listExpiredDomainHandler } from "./handlers/listExpiredDomainHandler";
import { GetCertDomainFn, ValidateDomainFn } from "./certificate/loadCert";

export const ACME_PATH = "/___acme";

type Props = {

  /**
   * Your Express app
   */
  app: any,

  /**
   * Path to store database
   */
  dbPath?: string,

  /**
   * DNS client to automatically create DNS record for wildcard domains
   */
  dnsClient?: AcmeDNSClientAbstract,
  httpClient?: AcmeDNSClientAbstract,

  /**
   * Check if domain is valid to create cert (avoid random domain pointing to your server)
   */
  validateDomain?: ValidateDomainFn,

  /**
   * Get the main domain name for certificate (i.e accessing a subdomain should be using the main domain's certificate)
   */
  getCertDomain?: GetCertDomainFn,

  /**
   * Domain that match with wildcard but not supported to be
   */
  wildcardExcludes?: string[]
}

export class AcmeExpress {

  private app: Express;
  private https: https.Server;

  constructor(props: Props) {

    this.app = props.app;
    this.https = createSSLServer(props.app, {
      validateDomain: props.validateDomain,
      getCertDomain: props.getCertDomain,
      wildcardExcludes: props.wildcardExcludes
    });

    const store = new KnexCertStore(props.dbPath || getAcmePath("acme.db"));
    CertStore.setStore(store);

    props.dnsClient && DNSClient.set("dns-01", props.dnsClient);
    props.httpClient && DNSClient.set("http-01", props.httpClient);

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

    if (process.env.ACME_EXPRESS_PRODUCTION !== "true" || process.env.ACME_EXPRESS_ENABLE_EXPIRE_LIST === "true") {
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