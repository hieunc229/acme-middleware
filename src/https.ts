
import https from 'https';
import { loadCert } from './certificate/loadCert';


const email = process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

export default function createSSLServer(app: any) {
    const server = https.createServer({
        SNICallback: (servername, cb) => {
            loadCert(servername, email)
                .then(ctx => {
                    cb(null, ctx)
                })
        },
        sessionTimeout: 15000
    }, app);
    return server;
}