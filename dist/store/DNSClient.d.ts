export declare abstract class AcmeDNSClientAbstract {
    abstract createRecord<T = any>(path: string, type: string, value: string): Promise<T>;
    abstract removeRecord<T = any>(data: any): Promise<T>;
}
declare const DNSClient: {
    get: () => AcmeDNSClientAbstract | undefined;
    set: (client: AcmeDNSClientAbstract) => void;
};
export default DNSClient;
