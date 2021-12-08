import { createChallenge } from "./create";

export type CreateChallengeProps = {
    email?: string,
    domain: string,
    altNames?: string[],
    revokeExistingCert?: boolean,
}

export async function renewDomain(props: CreateChallengeProps) {

    return createChallenge(props)
}
