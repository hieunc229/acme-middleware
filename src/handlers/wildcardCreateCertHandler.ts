import certificate from "../certificate/certificate";

import { Request, Response } from "express";
import { createChallenge } from "../functions/create";

export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean
}

export async function createCertWithWildcardHandler(req: WildcardCreateRequest, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    if (!req.skipChecking || "nocheck" in req.query === false) {
        const exists = certificate.exists(domain, `key.pem`);
        if (exists) {
            return res.status(409).json({
                status: 'failed',
                message: "Certificate already exists"
            })
        }
    }

    createChallenge({
        domain,
        altNames: "single" in req.query ? undefined : [`*.${domain}`]
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