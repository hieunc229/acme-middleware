"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../certificate/utils");
const knex_1 = require("knex");
class KnexCertStore {
    constructor(props, onReady) {
        this.t = (name) => {
            return this.db.table(name || "domains");
        };
        this.initate = () => {
            // TODO: migrate if schema changed
            utils_1.log("[ACME_EXPRESS_STORE] initiate...");
            this.db.schema.hasTable("domains")
                .then(exists => {
                if (!exists) {
                    this.setupTables(this.onReady);
                }
                else {
                    this.onReady && this.onReady();
                }
            })
                .catch(err => {
                utils_1.log("[ACME_EXPRESS_STORE] initiate failed.", err);
            });
        };
        this.setupTables = (cb) => {
            this.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.db.schema.transacting(tx).createTable("domains", builder => {
                    builder.string("id").primary();
                    builder.date("expire");
                    builder.json("dnsRecord");
                });
                yield this.db.schema.transacting(tx).createTable("challenge", builder => {
                    builder.string("id").primary();
                    builder.json("challenge");
                    builder.json("dnsRecord");
                    builder.json("altNames");
                    builder.json("order");
                });
            }))
                .then(rs => {
                cb && cb();
                utils_1.log("[ACME_EXPRESS_STORE] setup completed");
            })
                .catch(err => {
                utils_1.log("[ACME_EXPRESS_STORE] setup failed.", err);
            });
        };
        this.get = (table, key, options) => {
            if (!options && table in defaultOptions) {
                options = defaultOptions[table];
            }
            return new Promise((resolve, reject) => {
                this.t(table).select().where("id", "=", key)
                    .limit(1)
                    .then(rs => {
                    if (rs.length) {
                        const { jsonProperties } = options || {};
                        resolve(restoreJSONProperties(rs[0], jsonProperties));
                    }
                    reject(`${key} not found`);
                })
                    .catch(reject);
            });
        };
        /**
         * Remove a certificate
         */
        this.remove = (table, key) => {
            return new Promise((resolve, reject) => {
                this.t(table).where("id", "=", key).limit(1).delete()
                    .then(() => {
                    resolve();
                })
                    .catch(reject);
            });
        };
        /**
         * update certificate info (used when renewing certificate)
         */
        this.set = (table, key, data) => {
            return new Promise((resolve, reject) => {
                let insertData = {};
                Object.keys(data).forEach(k => {
                    if (typeof data[k] !== "object") {
                        insertData[k] = data[k];
                    }
                    else {
                        insertData[k] = JSON.stringify(data[k]);
                    }
                });
                function handleResolver() {
                    resolve(Object.assign({ id: key }, data));
                }
                this.t(table).insert(Object.assign({ id: key }, insertData))
                    .then(handleResolver)
                    .catch((err) => __awaiter(this, void 0, void 0, function* () {
                    if (err.toString().indexOf("SQLITE_CONSTRAINT: UNIQUE") !== -1) {
                        yield this.remove(table, key);
                        this.set(table, key, data)
                            .then(handleResolver)
                            .catch(reject);
                    }
                    reject(err);
                }));
            });
        };
        this.onReady = onReady;
        let options = typeof props === "string" ?
            {
                client: "sqlite3",
                connection: {
                    filename: props
                },
                useNullAsDefault: true
            } : props;
        this.db = knex_1.knex(options);
        utils_1.log("[CERTSTORE]", props);
        this.initate();
    }
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date, options) {
        let { page = 0, limit = 100, jsonProperties } = Object.assign(defaultOptions.domains, options);
        return new Promise((resolve, reject) => {
            this.t().where("expire", "<=", date.toJSON())
                .limit(limit)
                .offset(page * limit)
                .then(rs => {
                resolve(rs.map(item => restoreJSONProperties(item, jsonProperties)));
            })
                .catch(reject);
        });
    }
    destroy(confirm) {
        if (!confirm) {
            return Promise.reject(`Unable to destroy database since it hasn't been confirmed`);
        }
        return this.db.destroy();
    }
}
exports.default = KnexCertStore;
const defaultOptions = {
    domains: {
        jsonProperties: ["dnsRecord", "altNames"]
    },
    challenge: {
        jsonProperties: ["dnsRecord", "challenge", "order"]
    }
};
function restoreJSONProperties(data, properties) {
    let item = data;
    properties && properties.forEach(k => {
        if (k in item) {
            item[k] = JSON.parse(item[k]);
        }
    });
    return item;
}
