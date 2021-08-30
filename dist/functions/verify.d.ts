import { CertChallange } from "./create";
declare type VerifyResponse = {
    keyAuthorization: string;
    valid: boolean;
    address: string[][];
};
export declare function verifyDNS(data: CertChallange): Promise<VerifyResponse>;
export {};
