import { Challenge } from "acme-client/types/rfc8555";
import goPromise from "go-promise";
import DNSClient, { AcmeDNSClientType } from "../store/DNSClient";


export async function createDNS(options: {
  domain: string,
  name: string,
  challenge: Challenge, 
  keyAuthorization: string,
  type: AcmeDNSClientType
}) {
  const { challenge, keyAuthorization, name, domain,type } = options;

  let dnsRecord: any;
  const dnsClient = DNSClient.get(type);

  if (dnsClient) {

    let [requestError, request] = await goPromise(dnsClient.createRecord({
      name, domain, challenge,
      type: "TXT",
      token: challenge.token,
      value: keyAuthorization
    }));

    if (requestError !== null) {
      return Promise.reject(requestError)
    }

    dnsRecord = request.result;

    return dnsRecord;
  }

  return Promise.reject(`No DNSClient type ${type} found`);
}