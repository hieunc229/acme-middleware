import { Challenge } from "acme-client/types/rfc8555";
/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */
export declare function challengeCreateFn(challenge: Challenge, keyAuthorization: string): Promise<void>;
/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */
export declare function challengeRemoveFn(challenge: Challenge): Promise<void>;
export declare function log(...args: any[]): void;
