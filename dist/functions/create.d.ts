import { Challenge } from "acme-client/types/rfc8555";
export declare type CertChallange = {
    order: {
        url: string;
        identifiers: {
            type: string;
            value: string;
        }[];
        finalize: string;
        authorizations: string[];
        status: "pending" | "ready" | "processing" | "valid" | "invalid";
    };
    challenge: CertChallangeItem;
    dnsRecord?: any;
};
export declare type CertChallangeItem = {
    url: string;
    expires?: string;
    wildcard?: boolean;
    identifier: {
        type: string;
        value: string;
    };
    status: "pending" | "valid" | "invalid" | "deactivated" | "expired" | "revoked";
    dnsChallengeRecord: string;
    dnsChallange: Challenge;
    keyAuthorization: string;
    challenges: Challenge[];
};
export declare type CreateChallengeProps = {
    email?: string;
    domain: string;
    altNames?: string[];
};
export declare function createChallenge(props: CreateChallengeProps): Promise<CertChallange>;
