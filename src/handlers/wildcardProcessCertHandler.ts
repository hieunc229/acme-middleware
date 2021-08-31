import { Request, Response } from "express";
import processChallenge from "../functions/process";


export async function processCertWithWildcardHandler(req: Request, res: Response) {

    let domain = req.query.domain as string || req.hostname;

    processChallenge({ 
        domain, 
        altNames: [`*.${domain}`],
        skipDNSCheck: req.query['skip-dns'] === "true"
    })
        .then(data => {
            res.status(200).json({
                status: 'ok',
                data
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.toString()
            })
        })

}