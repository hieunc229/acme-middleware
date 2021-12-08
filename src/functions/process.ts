import acme from "acme-client";
import CertStore from "../store";
import certificate from "../certificate/certificate";
import DNSClient from "../store/DNSClient";

import { getClient } from "../certificate/client";
import { CertChallange } from "./create";
import { getFutureDate } from "../store/utils";
import { Challenge } from "acme-client/types/rfc8555";
import { log } from "../certificate/utils";
import { createDNS } from "./createDNS";
import goPromise from "go-promise";


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

  const order = await client.getOrder(item.order);
  const auths = await client.getAuthorizations(order);

  if (auths.length === 0) {
    return Promise.reject(`Unable to get authorization`)
  }

  return processChallengeRW({
    order: order,
    client,
    domain,
    altNames, auths,
    skipDNSCheck: opts.skipDNSCheck
  })
}


type ProcessChallengeProps = {
  order: acme.Order,
  client: acme.Client,
  domain: string,
  altNames?: string[],
  skipDNSCheck?: boolean,
  auths: acme.Authorization[];
}

export async function processChallengeRW(opts: ProcessChallengeProps) {

  const { domain, altNames, order, auths } = opts;
  const client = opts.client;
  const store = CertStore.getStore();

  log(domain + " Process cert", { domain, altNames });

  const dnsRecord = `_acme-challenge.${domain.replace("*.", "")}`;

  for (let authz of auths) {
    const { challenges } = authz;
    const challenge = challenges[0];

    if (!challenge) {
      log("authz", authz);
      log("challenges", challenges);
      log("auths", auths.map(a => a.challenges));
      return Promise.reject(`Unable to find challenge for ${domain}`);
    }

    if (challenge.status === "valid") {
      continue;
    }

    const keyAuthorization = await client.getChallengeKeyAuthorization(challenge);

    log(domain + " challenge", challenge.type, `: ${dnsRecord}:${keyAuthorization} (${challenge.token})`)

    if (opts.skipDNSCheck && challenge.type === "dns-01") {
    } else {

      const [createDNSRecordError, createDNSREcordResult] = await goPromise(createDNS({
        domain,
        name: dnsRecord,
        challenge,
        keyAuthorization,
        type: challenge.type,
      }));

      log(domain + " createDNS", createDNSREcordResult);
      if (createDNSRecordError) {
        return Promise.reject(createDNSRecordError || "Unable to create DNS record");
      }
    }

    const [verifyChallengeError, verifyChallengeResult] = await goPromise(client.verifyChallenge(authz, challenge));
    log(domain + " verify", verifyChallengeResult);
    if (verifyChallengeError) {
      return Promise.reject(verifyChallengeError || `Unable to verify challange. Please create TXT DNS record "${dnsRecord}: ${keyAuthorization}"`);
    }


    /* Notify ACME provider that challenge is satisfied */
    const [completeChallangeError, completeChallangeResult] = await goPromise(client.completeChallenge(challenge));
    log(domain + " completed", completeChallangeResult)
    if (completeChallangeError || !completeChallangeResult) {
      return Promise.reject(completeChallangeError || "Unable to complete challange");
    }

    /* Wait for ACME provider to respond with valid status */
    const [waitForValidateError, waitForValidateResult] = await goPromise(client.waitForValidStatus(challenge));
    log(domain + " statusChange", waitForValidateResult);
    if (waitForValidateError || !waitForValidateResult) {
      return Promise.reject(waitForValidateError || "Unable to wait for valid status");
    }
    if (waitForValidateResult.status !== "valid") {
      return Promise.reject(`ACME verification status must be valid. Current status ${waitForValidateResult.status}`)
    }

    const dnsClient = DNSClient.get(challenge.type);
    if (dnsClient && dnsRecord) {
      // const [removeDNSRecordError] = 
      await goPromise(dnsClient.removeRecord({ domain, dnsRecord, token: challenge.token }));
      // if (removeDNSRecordError) {
      //   return Promise.reject(removeDNSRecordError || "Unable to remove")
      // }
    }
  }

  if (order.status !== "valid") {
    let csrKey: Buffer;

    /**
     * Check if CSR key has already existed
     */
    if (certificate.exists(domain, "key.csr")) {
      csrKey = certificate.load(domain, "key.csr");
    } else {
      const [createCSRError, createCSRResult] = await goPromise(acme.forge.createCsr({
        commonName: domain,
        altNames: altNames
      }));

      log(domain + " createCSR", createCSRResult);
      if (createCSRError || !createCSRResult) {
        return Promise.reject(createCSRError || "Unable to createCSR");
      }

      const [key, csr] = createCSRResult;
      certificate.save(domain, `key.pem`, key);
      certificate.save(domain, `key.csr`, csr);
      csrKey = csr
    }

    let [finalizeOrderError, finalizeOrderResult] = await goPromise(client.finalizeOrder(order, csrKey));
    log(domain + " finalizeOrder", !!finalizeOrderResult)
    if (finalizeOrderError || !finalizeOrderResult) {
      return Promise.reject(finalizeOrderError || "Unable to finalize order");
    }

    if (["ready", "pending", "processing"].indexOf(finalizeOrderResult.status) !== -1) {
      return Promise.reject(`finalizeOrder.status must be ready/valid. Current status ${finalizeOrderResult.status}`)
    }
  }

  const [getCertError, getCertResult] = await goPromise(client.getCertificate(order));
  log(domain + " getCertificate", !!getCertResult);
  if (getCertError || !getCertResult) {
    return Promise.reject(getCertError || "Unable to get certificate");
  }

  certificate.save(domain, `cert.pem`, getCertResult);

  const [insertDomainError] = await goPromise(store.set("domains", domain, {
    expire: getFutureDate(90).toJSON()
  }));
  log(domain + " saveDomain");
  if (insertDomainError) {
    return Promise.reject(insertDomainError)
  }

  // Don't remove challange so in case the cert is removed, it can be request again
  // const [removeChallangeError] = await goPromise(store.remove("challenge", domain));
  // log(domain + " removeChallenge");
  // if (removeChallangeError) {
  //   return Promise.reject(removeChallangeError)
  // }
}
