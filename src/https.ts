import https from 'https';
import tls from "tls";
import getAcmePath from './pathUtils';

import { log } from "./certificate/utils";
import { checkDefaultCert } from './certificate/defaultCert';
import { loadCert, LoadCertOptions } from './certificate/loadCert';

const localCertPath = getAcmePath("default/cert.pem")
const localKeyPath = getAcmePath("default/key.pem");


export default function createSSLServer(app: any, options: LoadCertOptions) {

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
          log(`[${servername}]: Load cert error`, err);
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
