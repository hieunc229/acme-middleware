import tls from "tls";
import certificate from './certificate';

import { ACME_PATH } from "../AcmeExpress";
import { getDomainName } from "./domainUtils";
import { createCertAuto } from "../functions/createAuto";

export async function loadCert(servername: string, email?: string): Promise<tls.SecureContext> {

    const domain = getDomainName(servername);
    const exists = certificate.exists(domain, `key.pem`);

    let key: string | undefined, cert: string | undefined;

    if (!exists) {
        let altNames;

        if (servername === domain || servername.indexOf(ACME_PATH.substr(1)) === 0) {
            altNames = [`*.${domain}`];
        }

        let request = await createCertAuto({ domain, email });
        key = request[0]
        cert = request[1]
    }
    
    return tls.createSecureContext({
        key: key || certificate.load(domain, `key.pem`),
        cert: cert || certificate.load(domain, `cert.pem`)
    })
}
