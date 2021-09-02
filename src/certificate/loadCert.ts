import tls from "tls";
import certificate from './certificate';

import { ACME_PATH } from "../AcmeExpress";
import { getDomainName } from "./domainUtils";
import { createCertAuto } from "../functions/createAuto";

export type ValidateDomainFn = (options: { domain?: string }) => Promise<boolean>

export async function loadCert(domain: string, options?: { email?: string, validateDomain?: ValidateDomainFn }): Promise<tls.SecureContext> {

    // use getDomainName to get domain without subdomain

    const nonSubDomain = getDomainName(domain);
    const exists = certificate.exists(domain, `key.pem`);

    let key: string | undefined, cert: string | undefined;

    if (!exists) {


        if (options?.validateDomain) {

            if (! await options.validateDomain({ domain })) {
                return Promise.reject(`Domain ${domain} isn't supported`)
            }

        }

        let altNames;

        if (domain === nonSubDomain || domain.indexOf(ACME_PATH.substr(1)) === 0) {
            altNames = [`*.${domain}`];
        }

        let request = await createCertAuto({ domain, email: options?.email });
        key = request[0]
        cert = request[1]
    }

    return tls.createSecureContext({
        key: key || certificate.load(domain, `key.pem`),
        cert: cert || certificate.load(domain, `cert.pem`)
    })
}
