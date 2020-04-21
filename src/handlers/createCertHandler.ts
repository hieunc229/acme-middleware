import { Request, Response } from "express";
import certificate from "../certificate/certificate";
import createCert from "../certificate/createCert";

export async function createCertWithWildcardHandler(req: Request, res: Response) {

    let domain = req.hostname;
    const exists = certificate.exists(domain, `key.pem`);

    
    if (!exists) {
       let challenges = await createCert({ domain, altNames: [`*.${domain}`], challengeOnly: true });

        challenges ? res.status(200).json({
           status: 'pending',
           type: 'txt-record',
           value: `_acme-challenge.${domain}`,
           info: challenges
       }) : res.status(500).json({
           status: 'error',
           message: 'Unable to process. Please conact admin'
       })

       return;
    }

    res.status(409).json({
        status: 'already_exists'
    })
}