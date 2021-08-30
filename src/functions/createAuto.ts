import acme from "acme-client";

import CertStore from "../store";
import certificate from "../certificate/certificate";

import { getClient } from "../certificate/client";
import { getFutureDate } from "../store/utils";
import { challengeCreateFn, challengeRemoveFn } from "../certificate/utils";
import { Authorization, Challenge } from "acme-client/types/rfc8555";
import { CreateChallengeProps } from "./create";

export async function createCertAuto(props: CreateChallengeProps) {

    let { domain } = props;
    let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

    const client = await getClient(email);
    const [key, csr] = await acme.forge.createCsr({ commonName: domain });

    /* Certificate */
    const cert = await client.auto({
        csr,
        email: email,
        termsOfServiceAgreed: true,
        challengeCreateFn: createChallange,
        challengeRemoveFn: removeChallange
    });


    await certificate.save(domain, `key.pem`, key);
    await certificate.save(domain, `cert.pem`, cert);

    const store = CertStore.getStore();
    await store.set("domains", domain, { 
        expire: getFutureDate(90).toJSON()
    });

    return [key.toString(), cert]
}


/// https://github.com/publishlab/node-acme-client/blob/master/examples/auto.js

async function createChallange(authz: Authorization, challenge: Challenge, keyAuthorization: string) {
    challengeCreateFn(challenge, keyAuthorization)
}

async function removeChallange(authz: Authorization, challenge: Challenge, keyAuthorization: string) {
    challengeRemoveFn(challenge)
}