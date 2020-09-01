import { Certificate } from "./types";
export declare class FsCertStore {
    private path;
    constructor(props: {
        path: string;
    });
    /**
     * Insert a certificate
     */
    insert(domain: string, expiry: number): Promise<Certificate>;
    /**
     * Remove a certificate
     */
    remove(domain: string): Promise<any>;
    /**
     * update certificate info (used when renewing certificate)
     */
    update(domain: string, changes: any, override?: boolean): Promise<Certificate>;
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date: number): Promise<Certificate[]>;
    /**
     * Get a certificate
     */
    get(domain: string): Promise<Certificate>;
    private getAll;
    private save;
}
