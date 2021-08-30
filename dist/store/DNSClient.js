"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcmeDNSClientAbstract = void 0;
class AcmeDNSClientAbstract {
}
exports.AcmeDNSClientAbstract = AcmeDNSClientAbstract;
let _client;
const DNSClient = {
    get: () => {
        return _client;
    },
    set: (client) => {
        _client = client;
    }
};
exports.default = DNSClient;
