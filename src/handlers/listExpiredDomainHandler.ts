import { Request, Response } from "express";
import { listExpiredDomains } from "../functions/list";

/**
 * Get info of an existing challenge
 * @param req 
 * @param res 
 * @returns 
 */
export async function listExpiredDomainHandler(req: Request, res: Response) {

    const date = req.query.date ? new Date(req.query.date as string) : undefined;

    listExpiredDomains({ date })
        .then(async data => {

            res.status(200).json({
                status: 'ok',
                data,
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.toString()
            })
        })


}