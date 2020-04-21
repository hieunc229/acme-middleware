import tls from "tls";
import createCert from './createCert';
import certificate from './certificate';
import { getDomainName } from "./domainUtils";

export async function loadCert(servername: string, email?: string): Promise<tls.SecureContext> {

    let domain = getDomainName(servername);

    const exists = certificate.exists(domain, `key.pem`);

    if (!exists) {
        let altNames;
        servername === domain || servername.indexOf("_init-cert-wildcard") === 0 && (altNames = [`*.${domain}`]);
       await createCert({ domain, email, altNames });
    }

    return tls.createSecureContext({
        key: certificate.load(domain, `key.pem`),
        cert: certificate.load(domain, `cert.pem`)
    })
}
