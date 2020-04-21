"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class FsCertStore {
    constructor(props) {
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(this.path, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let certs = JSON.parse(data.toString());
                    resolve(certs);
                });
            });
        };
        this.save = (certs) => {
            return new Promise((resolve, reject) => {
                fs_1.default.writeFile(this.path, certs, (err) => {
                    err ? reject(err) : resolve();
                });
            });
        };
        if (!fs_1.default.existsSync(props.path)) {
            try {
                fs_1.default.mkdirSync(props.path);
            }
            catch (err) {
                console.log(`Unable to create certStore at ${props.path}. You need to create one yourself`);
            }
        }
        this.path = `${props.path}/data.json`;
    }
    /**
     * Insert a certificate
     */
    insert(domain, expiry) {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = { _id: domain, expiry };
                certs.push(cert);
                this.save(certs).then(() => resolve(cert)).catch(reject);
            });
        });
    }
    /**
     * Remove a certificate
     */
    remove(domain) {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let index = certs.findIndex(item => item._id === domain);
                if (index === -1) {
                    reject(new Error('Domain not exist'));
                    return;
                }
                certs.splice(index, 1);
                this.save(certs).then(resolve).catch(reject);
            });
        });
    }
    /**
     * update certificate info (used when renewing certificate)
     */
    update(domain, changes, override) {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let index = certs.findIndex(item => item._id === domain);
                if (index === -1) {
                    reject(new Error('Domain not exist'));
                    return;
                }
                const cert = Object.assign(Object.assign({}, certs[index]), changes);
                certs[index] = cert;
                this.save(certs).then(() => resolve(cert)).catch(reject);
            });
        });
    }
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date) {
        return new Promise((resolve) => {
            this.getAll.bind(this)().then(certs => {
                resolve(certs.filter(item => item.expiry <= date));
            });
        });
    }
    /**
     * Get a certificate
     */
    get(domain) {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = certs.find(c => c._id === domain);
                cert ? resolve(cert) : reject("Unable to fetch domain");
            });
        });
    }
}
exports.FsCertStore = FsCertStore;
