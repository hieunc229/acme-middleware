import AcmeDNSClientAbstract from "../modules/dns-client";
declare const DNSClient: {
    get: () => AcmeDNSClientAbstract | undefined;
    set: (client: AcmeDNSClientAbstract) => void;
};
export default DNSClient;
