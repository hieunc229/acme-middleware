export declare type CreateChallengeProps = {
    email?: string;
    domain: string;
    altNames?: string[];
};
export declare function renewDomain(props: CreateChallengeProps): Promise<import("./create").CertChallange>;
