import { Request, Response } from "express";
import { getOrder } from "../functions/order";

/**
 * Get info of an existing challenge
 * @param req 
 * @param res 
 * @returns 
 */
export async function orderInfoHandler(req: Request, res: Response) {

    const domain = req.query.domain as string || req.hostname;

    getOrder(domain, process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com")
        .then(async data => {
            res.status(200).json({
                status: 'ok',
                data
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