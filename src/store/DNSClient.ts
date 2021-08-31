import { CertChallangeItem } from "../functions/create";

export abstract class AcmeDNSClientAbstract {
    abstract createRecord<T = any>(options: {
        name: string,
        type: string,
        value: string,
        domain: string,
        challenge: CertChallangeItem
    }): Promise<T>
    abstract removeRecord<T = any>(data: any): Promise<T>
}

let _client: AcmeDNSClientAbstract | undefined;

const DNSClient = {

    get: () => {
        return _client;
    },

    set: (client: AcmeDNSClientAbstract) => {
        _client = client;
    }
}

export default DNSClient;
