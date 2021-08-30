import certificate from "../certificate/certificate";

import { Request, Response } from "express";
import { createCertAuto } from "../functions/createAuto";

export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean
}

export async function createCertAutoHandler(req: WildcardCreateRequest, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    if (!req.skipChecking || req.query['check-exists'] === "false") {
        const exists = certificate.exists(domain, `key.pem`);
        if (exists) {
            return res.status(409).json({
                status: 'failed',
                message: "Certificate already exists"
            })
        }
    }

    createCertAuto({ domain })
        .then(() => {
            res.status(200).json({
                status: 'ok'
            })
        }).catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.toString()
            })
        });

}