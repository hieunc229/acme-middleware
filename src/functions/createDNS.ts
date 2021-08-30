import DNSClient from "../store/DNSClient";
import { CertChallangeItem } from "./create";

export async function createDNS(challenge: CertChallangeItem, keyAuthorization: string) {
    let dnsRecord: any;
    const dnsClient = DNSClient.get();

    if (dnsClient) {
        let request = await dnsClient.createRecord(challenge.dnsChallengeRecord, "TXT", keyAuthorization);
        dnsRecord = request.result;
    }
    return dnsRecord;
}