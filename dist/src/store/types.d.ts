export declare type Certificate = {
    _id: string;
    expiry: number;
};
export declare type CertificateStore = {
    /**
     * Insert a certificate
     */
    insert: (domain: string, expiry: number) => Promise<Certificate>;
    /**
     * Remove a certificate
     */
    remove: (domain: string) => Promise<any>;
    /**
     * Remove a certificate
     */
    get(domain: string): Promise<Certificate>;
    /**
     * update certificate info (used when renewing certificate)
     */
    update: (domain: string, changes: any, override?: boolean) => Promise<Certificate>;
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate: (date: number) => Promise<Certificate[]>;
};
