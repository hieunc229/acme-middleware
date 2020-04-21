
import https from 'https';
import tls from "tls";
import { loadCert } from './certificate/loadCert';
// import { checkDefaultCert } from './certificate/defaultCert';

const localCertPath = process.env.ACME_EXPRESS_LOCAL_CERT || "/acme-express/certs/default/cert.pem";
const localKeyPath = process.env.ACME_EXPRESS_LOCAL_KEY || "/acme-express/certs/default/key.pem";


export default function createSSLServer(app: any) {

    // checkDefaultCert(localCertPath, localKeyPath);

    const server = https.createServer({
        SNICallback: (servername, cb) => {

            if (servername === "localhost") {
                localCertCB(cb);
                return;
            }

            loadCert(servername)
                .then(ctx => {
                    cb(null, ctx)
                })
                .catch(err => {
                    localCertCB(cb);
                })
        },
        sessionTimeout: 15000
    }, app);
    return server;
}

function localCertCB(cb: any) {
    cb(null, tls.createSecureContext({
        cert: localCertPath,
        key: localKeyPath
    }))
}
