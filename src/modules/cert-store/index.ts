import { Knex, knex } from "knex";

type CertificateStoreItem = any;
type TableName = "domains" | "challenge";

export default class KnexCertStore {

    private db: Knex;
    private onReady?: Function;

    constructor(props: Knex.Config | string, onReady?: Function) {

        this.onReady = onReady;
        let options: Knex.Config = typeof props === "string" ?
            {
                client: "sqlite3",
                connection: {
                    filename: props
                },
                useNullAsDefault: true
            } : props;

        this.db = knex(options);

        console.log("[CERTSTORE]", props);

        this.initate();
    }

    private t = (name?: TableName) => {
        return this.db.table(name || "domains");
    }
    
    private initate = () => {

        // TODO: migrate if schema changed
        console.log("[ACME_EXPRESS_STORE] initiate...")
        this.db.schema.hasTable("domains")
            .then(exists => {
                if (!exists) {
                    this.setupTables(this.onReady)
                } else {
                    this.onReady && this.onReady()
                }
            })
            .catch(err => {
                console.log("[ACME_EXPRESS_STORE] initiate failed.", err)
            })
    }

    private setupTables = (cb?: Function) => {

        this.db.transaction(async tx => {

            await this.db.schema.transacting(tx).createTable("domains", builder => {
                builder.string("id").primary();
                builder.date("expire");
                builder.json("dnsRecord");
            })

            await this.db.schema.transacting(tx).createTable("challenge", builder => {
                builder.string("id").primary();
                builder.json("challenge");
                builder.json("dnsRecord");
                builder.json("altNames");
                builder.json("order");
            })

        })
            .then(rs => {

                cb && cb()
                console.log("[ACME_EXPRESS_STORE] setup completed")
            })
            .catch(err => {
                console.log("[ACME_EXPRESS_STORE] setup failed.", err)
            })

    }

    get = <T = CertificateStoreItem>(table: TableName, key: string, options?: { jsonProperties: string[] }): Promise<T> => {

        if (!options && table in defaultOptions) {
            options = defaultOptions[table]
        }

        return new Promise((resolve, reject) => {

            this.t(table).select().where("id", "=", key)
                .limit(1)
                .then(rs => {
                    if (rs.length) {

                        const { jsonProperties } = options || {};
                        resolve(restoreJSONProperties(rs[0], jsonProperties))
                    }
                    reject(`${key} not found`);
                })
                .catch(reject)

        })
    }

    /**
     * Remove a certificate
     */
    remove = (table: TableName, key: string): Promise<void> => {

        return new Promise((resolve, reject) => {
            this.t(table).where("id", "=", key).limit(1).delete()
                .then(() => {
                    resolve()
                })
                .catch(reject)
        })
    }


    /**
     * update certificate info (used when renewing certificate)
     */
    set = (table: TableName, key: string, data: any): Promise<CertificateStoreItem> => {
        return new Promise((resolve, reject) => {

            let insertData: any = {};
            Object.keys(data).forEach(k => {
                if (typeof data[k] !== "object") {
                    insertData[k] = data[k]
                } else {
                    insertData[k] = JSON.stringify(data[k])
                }
            })

            function handleResolver() {
                resolve({ id: key, ...data })
            }

            this.t(table).insert({ id: key, ...insertData })
                .then(handleResolver)
                .catch(async err => {
                    if (err.toString().indexOf("SQLITE_CONSTRAINT: UNIQUE") !== -1) {
                        await this.remove(table, key);
                        this.set(table, key, data)
                            .then(handleResolver)
                            .catch(reject)
                    }
                    reject(err)
                })
        })
    }


    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate<T = CertificateStoreItem[]>(date: Date, options?: { page?: number, limit?: number, jsonProperties?: string[] }): Promise<T> {

        let { page = 0, limit = 100, jsonProperties } = Object.assign(defaultOptions.domains, options)

        return new Promise((resolve, reject) => {
            this.t().where("expire", "<=", date.toJSON())
                .limit(limit)
                .offset(page * limit)
                .then(rs => {
                    resolve(rs.map(item => restoreJSONProperties(item, jsonProperties)) as any)
                })
                .catch(reject)
        })
    }

    destroy(confirm?: boolean) {

        if (!confirm) {
            return Promise.reject(`Unable to destroy database since it hasn't been confirmed`);
        }

        return this.db.destroy()
    }
}

const defaultOptions = {
    domains: {
        jsonProperties: ["dnsRecord", "altNames"]
    },
    challenge: {
        jsonProperties: ["dnsRecord", "challenge", "order"]
    }
}

function restoreJSONProperties(data: any, properties?: string[]) {

    let item = data;

    properties && properties.forEach(k => {
        if (k in item) {
            item[k] = JSON.parse(item[k])
        }
    })

    return item;
}