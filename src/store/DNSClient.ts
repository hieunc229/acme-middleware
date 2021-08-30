export abstract class AcmeDNSClientAbstract {
    abstract createRecord<T = any>(path: string, type: string, value:string): Promise<T>
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
