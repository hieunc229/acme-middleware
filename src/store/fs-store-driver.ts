import fs from "fs";
import { CertificateStoreItem } from "./types";

export class FsCertStore {

    private path: string;

    constructor(props: { path: string }) {

        if (!fs.existsSync(props.path)) {

            try {
                fs.mkdirSync(props.path);
            } catch (err) {

                console.log(`Unable to create certStore at ${props.path}. You need to create one yourself. [ERR]: ${err}`)
            }
        }
        this.path = `${props.path}/data.json`;
    }

    /**
     * Insert a certificate
     */
    set(key: string, data: any): Promise<CertificateStoreItem> {

        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = { _id: key, ...data };
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
    // update(key: string, data: any): Promise<CertificateStoreItem> {

    //     return new Promise((resolve, reject) => {
    //         this.getAll.bind(this)().then(certs => {

    //             let index = certs.findIndex(item => item._id === key);

    //             if (index === -1) {
    //                 reject(new Error(`${key} doesn't exist`))
    //                 return;
    //             }

    //             const cert = { ...certs[index], ...data };
    //             certs[index] = cert;

    //             this.save(certs).then(() => resolve(cert)).catch(reject);
    //         })

    //     })
    // }

    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date: number): Promise<CertificateStoreItem[]> {

        return new Promise((resolve) => {
            this.getAll.bind(this)().then(certs => {
                resolve(certs.filter(item => item.expiry <= date));
            })

        })
    }


    /**
     * Get a certificate
     */
    get<T = CertificateStoreItem>(domain: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.getAll.bind(this)().then(certs => {
                let cert = certs.find(c => c._id === domain);
                cert ? resolve(cert as any) : reject("Unable to fetch domain")
            })

        })
    }

    private getAll = (): Promise<CertificateStoreItem[]> => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                let certs = JSON.parse(data.toString()) as CertificateStoreItem[];
                resolve(certs);
            })
        })
    }

    private save = (certs: CertificateStoreItem[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(certs), (err) => {
                err ? reject(err) : resolve()
            })
        })
    }
}