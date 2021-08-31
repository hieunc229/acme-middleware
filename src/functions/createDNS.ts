import DNSClient from "../store/DNSClient";
import { CertChallangeItem } from "./create";

export async function createDNS(challenge: CertChallangeItem, keyAuthorization: string) {
    let dnsRecord: any;
    const dnsClient = DNSClient.get();

    if (dnsClient) {
        let request = await dnsClient.createRecord({
            name: challenge.dnsChallengeRecord, 
            type: "TXT", 
            value: keyAuthorization,
            domain: challenge.identifier.value,
            challenge: challenge
        });
        dnsRecord = request.result;
    }
    return dnsRecord;
}