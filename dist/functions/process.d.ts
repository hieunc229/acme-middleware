import acme from "acme-client";
import { Challenge } from "acme-client/types/rfc8555";
declare type Props = {
    domain: string;
    altNames?: string[];
    email?: string;
    challengeOnly?: boolean;
};
export default function processChallenge(opts: Props): Promise<undefined>;
declare type ProcessChallengeProps = {
    order: acme.Order;
    client: acme.Client;
    challenge: Challenge;
    domain: string;
    altNames?: string[];
    auth: acme.Authorization;
};
export declare function processChallengeRW(opts: ProcessChallengeProps): Promise<undefined>;
export {};
