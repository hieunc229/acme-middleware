import { Request, Response } from "express";
export interface WildcardCreateRequest extends Request {
    skipChecking?: boolean;
}
export declare function createCertAutoHandler(req: WildcardCreateRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
