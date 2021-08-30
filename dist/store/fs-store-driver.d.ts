import { CertificateStoreItem } from "./types";
export declare class FsCertStore {
    private path;
    constructor(props: {
        path: string;
    });
    /**
     * Insert a certificate
     */
    set(key: string, data: any): Promise<CertificateStoreItem>;
    /**
     * Remove a certificate
     */
    remove(domain: string): Promise<any>;
    /**
     * update certificate info (used when renewing certificate)
     */
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate(date: number): Promise<CertificateStoreItem[]>;
    /**
     * Get a certificate
     */
    get<T = CertificateStoreItem>(domain: string): Promise<T>;
    private getAll;
    private save;
}
