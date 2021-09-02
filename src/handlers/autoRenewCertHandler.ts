import certificate from "../certificate/certificate";

import { Request, Response } from "express";
import { createCertAutoHandler } from "./autoCreateCertHandler";

export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean
}

export async function renewCertAutoHandler(req: WildcardCreateRequest, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    const exists = certificate.exists(domain, `key.pem`);
    if (exists) {
        if (req.query.confirm === "true") {
            await certificate.remove(domain);
        }
    }

    req.skipChecking = true;

    createCertAutoHandler(req, res)
}