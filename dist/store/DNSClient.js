"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
