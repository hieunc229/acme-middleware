import acme from "acme-client";
import CertStore from "../store";

import { Challenge } from "acme-client/types/rfc8555";
import { getClient } from "../certificate/client";
import { processChallengeRW } from "./process";
import { getAuthIdentifiers } from "./utils";
import { createDNS } from "./createDNS";

export type CertChallange = {
    order: {
        url: string,
        identifiers: {
            type: string;
            value: string;
        }[],
        finalize: string,
        authorizations: string[],
        status: "pending" | "ready" | "processing" | "valid" | "invalid",
    },
    challenge: CertChallangeItem,
    dnsRecord?: any
}

export type CertChallangeItem = {
    url: string,
    expires?: string,
    wildcard?: boolean,
    identifier: {
        type: string;
        value: string;
    },
    status: "pending" | "valid" | "invalid" | "deactivated" | "expired" | "revoked",
    dnsChallengeRecord: string,
    dnsChallange: Challenge,
    keyAuthorization: string,
    challenges: Challenge[]
}

export type CreateChallengeProps = {
    email?: string,
    domain: string,
    altNames?: string[]
}

export async function createChallenge(props: CreateChallengeProps) {

    let { domain, altNames } = props;
    let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

    const client = await getClient(email);

    let identifiers = getAuthIdentifiers(domain, altNames);

    /* Place new order */
    const order = await client.createOrder({ identifiers });
    const authorizations = await client.getAuthorizations(order);

    let challenge: CertChallangeItem | undefined;
    let authz: acme.Authorization | undefined;
    let allValid = true;

    authorizations.some(auth => {

        if (auth.status !== "valid") {
            allValid = false;
        }

        if (auth.status === "pending") {

            let dnsChallange = auth.challenges.find(item => item.type === "dns-01")

            if (dnsChallange) {
                authz = auth;
                challenge = {
                    url: auth.url,
                    expires: auth.expires,
                    wildcard: auth.wildcard,
                    identifier: auth.identifier,
                    status: auth.status,
                    dnsChallange: dnsChallange,
                    dnsChallengeRecord: `_acme-challenge.${auth.identifier.value}`,
                    challenges: auth.challenges,
                    keyAuthorization: ""
                }
            }
        }

        return challenge;
    })

    if (!challenge) {
        
        if (allValid) {
            return Promise.reject(`${domain} has already requested a certificate`)
        }

        return Promise.reject("Unable to find dns-01 challange")
    }

    const keyAuthorization = await client.getChallengeKeyAuthorization(challenge.dnsChallange);
    const dnsRecord = await createDNS(challenge, keyAuthorization);
   
    let store = CertStore.getStore();
    let output: CertChallange = {
        dnsRecord,
        challenge: {
            ...challenge,
            keyAuthorization
        },
        order: {
            url: order.url,
            identifiers: order.identifiers,
            finalize: order.finalize,
            authorizations: order.authorizations,
            status: order.status
        }
    }

    await store.set("challenge", domain, output);

    if (!dnsRecord) {
        return Promise.reject(`No DNSClient was provided. 
        Now, you need to create a TXT record name=${challenge.dnsChallengeRecord}, value=${keyAuthorization}. 
        More details at https://github.com/hieunc229/acme-middleware/blob/origin/docs/update-dns.md
        `)
    }

    if (challenge && authz) {
        await processChallengeRW({
            challenge: challenge.dnsChallange,
            altNames,
            domain,
            client,
            order,
            auth: authz
        })
    }


    return output;

}