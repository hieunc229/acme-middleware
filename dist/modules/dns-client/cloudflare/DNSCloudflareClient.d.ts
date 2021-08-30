import AcmeDNSClientAbstract from "../AcmeDNSClientAbstract";
export default class DNSCloudflareClient extends AcmeDNSClientAbstract {
    private token;
    private zoneId;
    createRecord<T = CreateDNSRecordResponse>(name: string, type: "TXT" | "A" | "CNAME", value: string, ttl?: number): Promise<T>;
    removeRecord<T = DeleteDNSRecordResponse>(dnsId: any): Promise<T>;
    private r;
}
declare type DeleteDNSRecordResponse = {
    result: {
        id: string;
    };
};
declare type CreateDNSRecordResponse = {
    "success": boolean;
    "errors": any[];
    "messages": any[];
    "result": CloudFlareDNSRecord;
};
declare type CloudFlareDNSRecord = {
    "id": string;
    "type": string;
    "name": string;
    "content": string;
    "proxiable": boolean;
    "proxied": boolean;
    "ttl": number;
    "locked": boolean;
    "zone_id": string;
    "zone_name": string;
    "created_on": string;
    "modified_on": string;
    "data": any;
    "meta": {
        "auto_added": boolean;
        "source": string;
    };
};
export {};
