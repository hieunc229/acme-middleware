/**
 * Function used to satisfy an ACME challenge
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @param {string} keyAuthorization Authorization key
 * @returns {Promise}
 */
export declare function challengeCreateFn(authz: any, challenge: any, keyAuthorization: any): Promise<void>;
/**
 * Function used to remove an ACME challenge response
 *
 * @param {object} authz Authorization object
 * @param {object} challenge Selected challenge
 * @returns {Promise}
 */
export declare function challengeRemoveFn(authz: any, challenge: any, keyAuthorization: any): Promise<void>;
export declare function log(m: any, ...args: string[]): void;
