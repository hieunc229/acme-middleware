import certificate from "../certificate/certificate";

import { Request, Response } from "express";
import { createCertWithWildcardHandler, WildcardCreateRequest } from "./wildcardCreateCertHandler";
import CertStore from "../store";
import { log } from "../certificate/utils";


export function renewCertWithWildcardHandler(req: Request, res: Response) {
  handler(req, res);
}

async function handler(req: WildcardCreateRequest, res: Response) {
  const domain = req.query.domain as string || req.hostname;
  const exists = certificate.exists(domain, `key.pem`);

  if (exists) {

    log("01. Check exists")
    const store = CertStore.getStore();

    if (req.query.clear === "true") {
      await store.remove("challenge", domain);
    }

    // if (req.query.clean === "true") {
    //   await certificate.remove(domain);
    // }
  }

  req.skipChecking = true;

  createCertWithWildcardHandler(req, res)
}