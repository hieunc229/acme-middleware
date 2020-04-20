import acme from "acme-client";
import certificate from "./certificate";
import CertStore from "../store";

import { getClient } from "./account";
import { challengeRemoveFn, challengeCreateFn } from "./utils";
import { getFutureDate } from "../store/utils";


type Props = { domain: string, altNames?: string[], email: string };

export default async function createCert(opts: Props) {

  let { email, domain, altNames } = opts;
  const client = await getClient(email);

  let identifiers = [{ type: 'dns', value: domain }];
  
  altNames && (identifiers = identifiers.concat(
    altNames.map(value => {
      return { type: 'dns', value };
    })
  ));

  /* Place new order */
  const order = await client.createOrder({ identifiers });

  /**
  * authorizations / client.getAuthorizations(order);
  * An array with one item per DNS name in the certificate order.
  * All items require at least one satisfied challenge before order can be completed.
  */

  const authorizations = await client.getAuthorizations(order);

  const promises = authorizations.map(async (authz) => {
    /**
     * challenges / authz.challenges
     * An array of all available challenge types for a single DNS name.
     * One of these challenges needs to be satisfied.
     */

    const { challenges } = authz;

    /* Just select any challenge */
    const challenge = challenges.shift() as any;
    const keyAuthorization = await client.getChallengeKeyAuthorization(challenge);

    // log("keyAuthorization", keyAuthorization);

    try {
      /* Satisfy challenge */
      await challengeCreateFn(authz, challenge, keyAuthorization);

      /* Verify that challenge is satisfied */
      await client.verifyChallenge(authz, challenge);

      /* Notify ACME provider that challenge is satisfied */
      await client.completeChallenge(challenge);

      /* Wait for ACME provider to respond with valid status */
      await client.waitForValidStatus(challenge);
    }
    finally {
      /* Clean up challenge response */
      try {
        await challengeRemoveFn(authz, challenge, keyAuthorization);
      }
      catch (e) {
        /**
         * Catch errors thrown by challengeRemoveFn() so the order can
         * be finalized, even though something went wrong during cleanup
         */
      }
    }
  });

  /* Wait for challenges to complete */
  await Promise.all(promises);

  /* Finalize order */
  const [key, csr] = await acme.forge.createCsr({
    commonName: domain,
    altNames: altNames
  });

  await client.finalizeOrder(order, csr);
  const cert = await client.getCertificate(order);

  await certificate.save(domain, `key.pem`, key);
  await certificate.save(domain, `cert.pem`, cert);

  await CertStore.getStore().insert(domain, getFutureDate(90).getTime());
}
