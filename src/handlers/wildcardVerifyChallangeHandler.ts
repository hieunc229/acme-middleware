
import { Request, Response } from "express";
import infoChallange from "../functions/info";

import DNS from "dns"

export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean
}

export async function verifyCertWithWildcardHandler(req: WildcardCreateRequest, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    infoChallange({ domain })
        .then(data => {

            DNS.resolveTxt(data.challenge.dnsChallengeRecord, (err, address) => {

                if (err) {
                    res.status(500).json({
                        status: 'error',
                        domain,
                        message: err.toString()
                    })
                }

                res.status(200).json({
                    status: 'ok',
                    data: {
                        keyAuthorization: data.challenge.keyAuthorization,
                        valid: address.flat().indexOf(data.challenge.keyAuthorization) !== -1,
                        address
                    }
                })

            })

           
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                domain,
                message: err.toString()
            })
        })
}
