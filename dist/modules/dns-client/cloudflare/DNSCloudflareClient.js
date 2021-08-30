"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AcmeDNSClientAbstract_1 = __importDefault(require("../AcmeDNSClientAbstract"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class DNSCloudflareClient extends AcmeDNSClientAbstract_1.default {
    constructor() {
        super(...arguments);
        //https://github.com/cloudflare/node-cloudflare
        // Get token from "My profile -> API Token"
        this.token = process.env.ACME_EXPRESS_CLOUDFLARE_TOKEN || "";
        //I t’s in the Overview tab for that domain. Right hand column in the API section. Scroll down a bit.
        this.zoneId = process.env.ACME_EXPRESS_CLOUDFLARE_ZONE_ID || "";
    }
    createRecord(name, type, value, ttl) {
        const data = {
            type,
            name,
            content: value,
            ttl: ttl || 1 // 1 is "auto"
        };
        return this.r(`zones/${this.zoneId}/dns_records`, {
            method: 'POST',
            data
        });
    }
    removeRecord(dnsId) {
        return this.r(`zones/${this.zoneId}/dns_records/${dnsId}`, {
            method: 'DELETE'
        });
    }
    r(path, init) {
        const { data, method = "GET" } = init || {};
        return new Promise((resolve, reject) => {
            node_fetch_1.default(`https://api.cloudflare.com/client/v4/${path}`, {
                method,
                body: data ? JSON.stringify(data) : "",
                headers: Object.assign(Object.assign({}, init === null || init === void 0 ? void 0 : init.headers), { "Authorization": `Bearer ${this.token}` })
            })
                .then(rs => rs.json())
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.default = DNSCloudflareClient;
