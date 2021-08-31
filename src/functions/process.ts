import acme from "acme-client";
import CertStore from "../store";
import certificate from "../certificate/certificate";
import DNSClient from "../store/DNSClient";

import { getClient } from "../certificate/client";
import { CertChallange } from "./create";
import { getFutureDate } from "../store/utils";
import { Challenge } from "acme-client/types/rfc8555";
import { log } from "../certificate/utils";
import { verifyDNS } from "./verify";
import { createDNS } from "./createDNS";


type Props = { 
    domain: string, 
    altNames?: string[], 
    email?: string, 
    skipDNSCheck?: boolean 
};

export default async function processChallenge(opts: Props) {

    let { domain, altNames } = opts;
    let email = opts.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

    const store = CertStore.getStore();
    const client = await getClient(email);
    const item = await store.get<CertChallange>("challenge", domain);

    let challenge = item.challenge.dnsChallange;

    const order = await client.getOrder(item.order);
    const auths = await client.getAuthorizations(order);

    if (auths.length === 0) {
        return Promise.reject(`Unable to get authorization`)
    }

    const authz = auths[0];

    return processChallengeRW({
        order: order,
        client,
        challenge,
        domain,
        altNames,
        auth: authz,
        skipDNSCheck: opts.skipDNSCheck
    })
}


type ProcessChallengeProps = {
    order: acme.Order,
    client: acme.Client,
    challenge: Challenge,
    domain: string,
    altNames?: string[],
    auth: acme.Authorization,
    skipDNSCheck?: boolean
}

export async function processChallengeRW(opts: ProcessChallengeProps) {

    // if (["valid", "ready"].indexOf(opts.order.status) === -1) {
    //     return Promise.reject(`Order status must be ready/valid. Current status ${opts.order.status}`)
    // }

    const { domain, altNames } = opts;

    const store = CertStore.getStore();
    const client = opts.client
    const item = await store.get<CertChallange>("challenge", domain);
    const order = opts.order;

    const challenge = opts.challenge;
    let dnsRecord = item.dnsRecord;

    if (opts.skipDNSCheck === true) {
        const dnsValid = await verifyDNS(item);


        if (!dnsValid.valid) {
            dnsRecord = await createDNS(item.challenge, item.challenge.keyAuthorization);
        }
    }

    const verify = await client.verifyChallenge(opts.auth, challenge);
    log("verify", verify)

    /* Notify ACME provider that challenge is satisfied */
    const completed = await client.completeChallenge(challenge);
    log("completed", completed)
    if (completed.status !== "valid") {
        return Promise.reject(`Challange status must be valid. Current status ${completed.status}`)
    }

    /* Wait for ACME provider to respond with valid status */
    const statusChange = await client.waitForValidStatus(challenge);
    log("statusChange", statusChange)
    if (statusChange.status !== "valid") {
        return Promise.reject(`ACME verification status must be valid. Current status ${completed.status}`)
    }

    /* Finalize order */
    const [key, csr] = await acme.forge.createCsr({
        commonName: domain,
        altNames: altNames
    });

    let finalizeOrder = await client.finalizeOrder(order, csr);
    log("finalizeOrder", finalizeOrder)

    if (["ready", "pending", "processing"].indexOf(order.status) !== -1) {
        return Promise.reject(`ACME verification status must be ready/valid. Current status ${finalizeOrder.status}`)
    }

    const cert = await client.getCertificate(order);

    await certificate.save(domain, `key.pem`, key);
    await certificate.save(domain, `cert.pem`, cert);

    await store.set("domains", domain, {
        expire: getFutureDate(90).toJSON(),
        dnsRecord: dnsRecord,
        altNames
    });

    const dnsClient = DNSClient.get();

    if (dnsClient && dnsRecord) {
        await dnsClient.removeRecord(dnsRecord.id)
    }

    await store.remove("challenge", domain);

}
