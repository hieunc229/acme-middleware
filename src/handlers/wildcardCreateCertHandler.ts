import certificate from "../certificate/certificate";

import { Request, Response } from "express";
import { createChallenge } from "../functions/create";
import { log } from "../certificate/utils";

export interface WildcardCreateRequest extends Request {
  skipChecking?: boolean
}

export async function createCertWithWildcardHandler(req: WildcardCreateRequest, res: Response) {

  let domain = req.query.domain as string || req.hostname;
  let altName = `*.${domain}`;

  if (domain.indexOf("*.") !== -1) {
    altName = (req.query.domain as string || req.hostname).replace("*.", "");
  } 

  if (!req.skipChecking || "nocheck" in req.query === false) {
    log("02. Remove certs")
    const exists = certificate.exists(domain, `cert.pem`);
    if (exists) {
      return res.status(409).json({
        status: 'failed',
        message: "Certificate already exists"
      })
    }
  }

  createChallenge({
    domain,
    altNames: "single" in req.query ? undefined : [altName],
    revokeExistingCert: req.query.revoke === "true",
    skipValidateChallange: req.query.svc === "true",
    skipCreateDNS: req.query.sdns === "true"
  })
    .then(data => {
      res.status(200).json({
        status: 'ok',
        data
      })
    }).catch(err => {
      res.status(500).json({
        status: 'error',
        message: err.toString()
      })
    });

}