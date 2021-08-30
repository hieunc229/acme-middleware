import { createChallenge } from "./create";

export type CreateChallengeProps = {
    email?: string,
    domain: string,
    altNames?: string[]
}

export async function renewDomain(props: CreateChallengeProps) {

    return createChallenge(props)
}
