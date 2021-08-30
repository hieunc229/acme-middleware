import { Request, Response } from "express";
export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean;
}
export declare function verifyCertWithWildcardHandler(req: WildcardCreateRequest, res: Response): Promise<void>;
