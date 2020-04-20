import { createChallenge, removeChallenge } from "./challengeUtils";

/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */
export async function challengeCreateFn(authz: any, challenge: any, keyAuthorization: any) {
    return createChallenge(challenge.token, keyAuthorization);
}


/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */

export async function challengeRemoveFn(authz: any, challenge: any, keyAuthorization: any) {
    /* Do something here */
    // log(JSON.stringify(authz));
    // log(JSON.stringify(challenge));
    // log(keyAuthorization);

    // console.log("remove", challenge.token);
    return removeChallenge(challenge.token);
}


export function log(m: any, ...args: string[]) {
    process.stdout.write(`${m}\n`);
// console.log(arguments)}
}