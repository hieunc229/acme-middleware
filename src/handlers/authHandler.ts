import { NextFunction, Request, Response } from "express";

export async function authHandler(req: Request, res: Response, next: NextFunction) {

    if (process.env.ACME_EXPRESS_AUTH_KEY) {
        const auth = req.headers.authorization
        if (!auth || auth.substr(8) !== process.env.ACME_EXPRESS_AUTH_KEY) {
            return res.status(401).json({ 
                status: "failed",
                message: "unauthorized access"
            })
        }

    }

    next()
}