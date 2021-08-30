import infoChallange from "../functions/info";

import { Request, Response } from "express";
import { verifyDNS } from "../functions/verify";

/**
 * Get info of an existing challenge
 * @param req 
 * @param res 
 * @returns 
 */
export async function infoCertWithWildcardHandler(req: Request, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    infoChallange({ domain })
        .then(async data => {

            const verifyStatus = await verifyDNS(data);

            res.status(200).json({
                status: 'ok',
                data,
                verifyStatus
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