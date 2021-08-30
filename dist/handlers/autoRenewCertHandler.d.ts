import { Request, Response } from "express";
export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean;
}
export declare function renewCertAutoHandler(req: WildcardCreateRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
