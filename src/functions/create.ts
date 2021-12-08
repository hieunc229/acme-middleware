import acme from "acme-client";
import CertStore from "../store";

import { Challenge } from "acme-client/types/rfc8555";
import { getClient } from "../certificate/client";
import { processChallengeRW } from "./process";
import { getAuthIdentifiers } from "./utils";
import { createDNS } from "./createDNS";
import { log } from "../certificate/utils";

import goPromise from "go-promise";
import certificate from "../certificate/certificate";

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
  altNames?: string[],
  skipCreateDNS?: boolean,
  skipValidateChallange?: boolean,
  revokeExistingCert?: boolean,
}

export async function createChallenge(props: CreateChallengeProps) {

  let { domain, altNames } = props;
  let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

  log("03. Create challange", { domain, altNames })

  const [clientError, client] = await goPromise(getClient(email));

  if (clientError !== null || client === undefined) {
    return Promise.reject(clientError || "Unable to get client")
  }

  if (props.revokeExistingCert) {
    let cert = certificate.load(domain, "cert.pem");
    let [revokeError] = await goPromise(client.revokeCertificate(cert));

    if (revokeError) {
      return Promise.reject(revokeError);
    }
  }

  let identifiers = getAuthIdentifiers(domain, altNames);

  /* Place new order */
  const [orderError, order] = await goPromise(client.createOrder({ identifiers }));

  if (orderError !== null || order === undefined) {
    return Promise.reject(orderError || "Unable to get order")
  }

  const [authError, authorizations] = await goPromise(client.getAuthorizations(order));

  if (authError !== null || authorizations === undefined) {
    return Promise.reject(authError || "Unable to get authorizations")
  }

  log("04. Validate authz");

  let dnsRecord = "unset";

  let store = CertStore.getStore();
  let output: CertChallange = {
    dnsRecord,
    challenge: {} as any,
    order: {
      url: order.url,
      identifiers: order.identifiers,
      finalize: order.finalize,
      authorizations: order.authorizations,
      status: order.status
    }
  }

  let [setStoreError] = await goPromise(store.set("challenge", domain, output));
  log("08. Save DNS challenge to store");

  if (setStoreError !== null) {
    return Promise.reject(setStoreError)
  }

  if (!dnsRecord) {
    return Promise.reject(`No DNSClient was provided. 
        More details at https://github.com/hieunc229/acme-middleware/blob/origin/docs/update-dns.md
        `)
  }


  log("09. processChallengeRW")

  let [processError] = await goPromise(processChallengeRW({
    altNames,
    domain,
    client,
    order,
    auths: authorizations
  }));

  if (processError !== null) {
    return Promise.reject(processError || "Unable to process/create certficate")
  }
}