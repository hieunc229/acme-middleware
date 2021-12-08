import tls from "tls";
import certificate from './certificate';

import { ACME_PATH } from "../AcmeExpress";
import { getDomainName } from "./domainUtils";
import { createCertAuto } from "../functions/createAuto";
import { log } from "./utils";
import goPromise from "go-promise";

export type ValidateDomainFn = (options: { domain: string, nonSubDomain: string }) => Promise<boolean>

export type GetCertDomainOptions = { domain: string, nonSubDomain: string }
export type GetCertDomainFn = (options: GetCertDomainOptions) => string

export type LoadCertOptions = {
  email?: string,
  wildcardExcludes?: string[],
  validateDomain?: ValidateDomainFn,
  getCertDomain?: GetCertDomainFn,
}

export async function loadCert(originalDomain: string, options?: LoadCertOptions): Promise<tls.SecureContext> {

  // use getDomainName to get domain without subdomain

  const nonSubDomain = getDomainName(originalDomain);

  let domain = originalDomain;

  if (options?.getCertDomain) {
    domain = options.getCertDomain({ 
      domain: originalDomain, 
      nonSubDomain,
     })
  }

  const exists = certificate.exists(domain, `cert.pem`);

  log("01. Load cert", { nonSubDomain, exists, domain: originalDomain, certDomain: domain });

  let key: string | undefined, cert: string | undefined;

  if (!exists) {

    if (options?.validateDomain) {

      const [validateError, validateResult] = await goPromise(options.validateDomain({ domain: originalDomain, nonSubDomain }));

      if (validateError) {
        return Promise.reject(validateError)
      }

      if (!validateResult) {
        return Promise.reject(`Domain ${domain} isn't supported`)
      }
    }

    let altNames;

    if (!options?.wildcardExcludes?.includes(domain) && (domain === nonSubDomain || domain.indexOf(ACME_PATH.substr(1)) === 0)) {
      altNames = [`*.${domain}`];
    }

    let request = await createCertAuto({ domain, email: options?.email, altNames });
    key = request[0]
    cert = request[1]
  }

  return tls.createSecureContext({
    key: key || certificate.load(domain, `key.pem`),
    cert: cert || certificate.load(domain, `cert.pem`)
  })
}