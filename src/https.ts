import https from 'https';
import tls from "tls";
import getAcmePath from './pathUtils';

import { log } from "./certificate/utils";
import { checkDefaultCert } from './certificate/defaultCert';
import { loadCert, LoadCertOptions } from './certificate/loadCert';

import { Express } from "express";

const localCertPath = getAcmePath("default/cert.pem")
const localKeyPath = getAcmePath("default/key.pem");

const IPRegex = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;

export default function createSSLServer(app: Express, options: LoadCertOptions) {

  checkDefaultCert(localCertPath, localKeyPath);

  const server = https.createServer({
    SNICallback: (servername, cb) => {

      if (IPRegex.test(servername)) {
        return cb(new Error("Not supporting for IP address"));
      }

      if (servername === "localhost") {
        localCertCB(cb);
        return;
      }

      if (/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(servername)) {
        cb(new Error("Invalid name"))
        return;
      }

      loadCert(servername, options)
        .then(ctx => {
          console.log(ctx);
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
