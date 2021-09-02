import https from 'https';
import tls from "tls";
import getAcmePath from './pathUtils';

import { loadCert, ValidateDomainFn } from './certificate/loadCert';
import { checkDefaultCert } from './certificate/defaultCert';

const localCertPath = getAcmePath("default/cert.pem")
const localKeyPath = getAcmePath("default/key.pem");


export default function createSSLServer(app: any, options: {
    validateDomain?: ValidateDomainFn
}) {

    checkDefaultCert(localCertPath, localKeyPath);

    const server = https.createServer({
        SNICallback: (servername, cb) => {

            if (servername === "localhost") {
                localCertCB(cb);
                return;
            }

            loadCert(servername, options)
                .then(ctx => {
                    cb(null, ctx)
                })
                .catch(err => {
                    return cb(err)
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
