import acme from "acme-client";

import CertStore from "../store";
import certificate from "../certificate/certificate";

import { getClient } from "../certificate/client";
import { getFutureDate } from "../store/utils";
import { challengeCreateFn, challengeRemoveFn, log } from "../certificate/utils";
import { Authorization, Challenge } from "acme-client/types/rfc8555";
import { CreateChallengeProps } from "./create";
import goPromise from "go-promise";

export async function createCertAuto(props: CreateChallengeProps) {

  let { domain } = props;
  let email = props.email || process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com";

  log(domain + "01. Create cert auto", domain);


  const [clientError, client] = await goPromise(getClient(email));

  log(domain + " getClient:", !!client);
  if (!client || clientError !== null) {
    return Promise.reject(clientError)
  }
  let commonName = domain;
  let altNames: string[] = [];//[`www.${domain}`];

  const [createCSRError, CSRResult] = await goPromise(acme.forge.createCsr({
    commonName,
    altNames
  }));

  log(domain + " createCSR:", CSRResult);

  if (!CSRResult || createCSRError !== null) {
    return Promise.reject(createCSRError)
  }

  const [key, csr] = CSRResult;
  // let cert = "" as any;

  /* Certificate */
  const [createCertError, cert] = await goPromise(client.auto({
    csr,
    email: email,
    termsOfServiceAgreed: true,
    challengeCreateFn: createChallange,
    challengeRemoveFn: removeChallange
  }));

  log(domain + " createCert:", cert);

  if (!cert || createCertError) {
    log(domain, "error", createCertError);
    return Promise.reject(createCertError)
  }

  await certificate.save(domain, `key.pem`, key);
  await certificate.save(domain, `cert.pem`, cert);

  const store = CertStore.getStore();

  const [setDomainError] = await goPromise(store.set("domains", domain, {
    expire: getFutureDate(90).toJSON()
  }));

  if (setDomainError !== null) {
    return Promise.reject(setDomainError)
  }

  return [key.toString(), cert]
}


/// https://github.com/publishlab/node-acme-client/blob/master/examples/auto.js

async function createChallange(authz: Authorization, challenge: Challenge, keyAuthorization: string) {
  challengeCreateFn(challenge, keyAuthorization)
}

async function removeChallange(authz: Authorization, challenge: Challenge, keyAuthorization: string) {
  challengeRemoveFn(challenge)
}