import tls from "tls";
import createCert from './createCert';
import certificate from './certificate';

export async function loadCert(domain: string, email: string): Promise<tls.SecureContext> {

    const exists = certificate.exists(domain, `key.pem`);

    if (!exists) {
       await createCert({ domain, email });
    }

    return tls.createSecureContext({
        key: certificate.load(domain, `key.pem`),
        cert: certificate.load(domain, `cert.pem`)
    })
}
