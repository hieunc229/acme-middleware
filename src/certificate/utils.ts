import { Challenge } from "acme-client/types/rfc8555";
import { createChallenge, removeChallenge } from "./challengeUtils";

/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */
export async function challengeCreateFn(challenge: Challenge, keyAuthorization: string) {
  return createChallenge(challenge.token, keyAuthorization);
}


/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */

export async function challengeRemoveFn(challenge: Challenge) {
  /* Do something here */
  // log(JSON.stringify(authz));
  // log(JSON.stringify(challenge));
  // log(keyAuthorization);

  // console.log("remove", challenge.token);
  return removeChallenge(challenge.token);
}


export function log(...args: any[]) {
  if (process.env.ACME_EXPRESS_PRODUCTION !== "true" || process.env.ACME_EXPRESS_DEBUG === "true") {
    try {
      console.log(`[${new Date().toJSON()}]`, ...args);
    } catch (err) {
      console.log(`[${new Date().toJSON()}]`, "failed to print");
    }
  }
}

export function handleReject(reason: any) {
  log(`[reject]: ${reason}`);
  return Promise.reject(reason);
}