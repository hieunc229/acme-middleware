import { Challenge } from "acme-client/types/rfc8555";

export type AcmeDNSClientType = "http-01" | "dns-01";

export abstract class AcmeDNSClientAbstract {
  abstract createRecord<T = any>(options: {
    name: string,
    type: string,
    value: string,
    domain: string,
    token: string,
    challenge: Challenge
  }): Promise<T>
  abstract removeRecord<T = any>(data: any): Promise<T>
}

class _dnsClients {
  private _client: { [type in AcmeDNSClientType]?: AcmeDNSClientAbstract } = {};

  get(type: AcmeDNSClientType){
    console.log("get", type);
    return this._client[type];
  }

  set(type: AcmeDNSClientType, client: AcmeDNSClientAbstract)  {
    console.log("set", type);
    this._client[type] = client;
  }
}

const DNSClient = new _dnsClients();

export default DNSClient;
