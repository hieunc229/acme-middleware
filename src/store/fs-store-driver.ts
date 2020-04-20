import fs from "fs";
import { Certificate } from "./types";

export class FsCertStore {

    private path: string;

    constructor(props: { path: string }) {
        this.path = props.path;
    }

    /**
     * Insert a certificate
     */
    insert(domain: string, expiry: number): Promise<Certificate> {

        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = { _id: domain, expiry };
                certs.push(cert);
                this.save(certs).then(() => resolve(cert)).catch(reject);
            })

        })
    }

    /**
     * Remove a certificate
     */
    remove(domain: string): Promise<any> {

        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {

                let index = certs.findIndex(item => item._id === domain);


                if (index === -1) {
                    reject(new Error('Domain not exist'))
                    return;
                }

                certs.splice(index, 1);

                this.save(certs).then(resolve).catch(reject);
            })

        })
    }

    /**
     * update certificate info (used when renewing certificate)
     */
    update(domain: string, changes: any, override?: boolean): Promise<Certificate> {

        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {

                let index = certs.findIndex(item => item._id === domain);

                if (index === -1) {
                    reject(new Error('Domain not exist'))
                    return;
                }

                const cert = { ...certs[index], ...changes };
                certs[index] = cert;

                this.save(certs).then(() => resolve(cert)).catch(reject);
            })

        })
    }

    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date: number): Promise<Certificate[]> {

        return new Promise((resolve) => {
            this.getAll.bind(this)().then(certs => {
                resolve(certs.filter(item => item.expiry <= date));
            })

        })
    }


    /**
     * Get a certificate
     */
    get(domain: string): Promise<Certificate> {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = certs.find(c => c._id === domain);
                cert ? resolve(cert) : reject("Unable to fetch domain")
            })

        })
    }

    private getAll = (): Promise<Certificate[]> => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                let certs = JSON.parse(data.toString()) as Certificate[];
                resolve(certs);
            })
        })
    }

    private save = (certs: Certificate[]) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, certs, (err) => {
                err ? reject(err) : resolve()
            })
        })
    }
}