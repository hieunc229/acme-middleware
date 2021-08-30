export type Certificate = {
    _id: string,
    expiry: number
}

export type CertificateStoreItem = { id: string, [name: string]: any }


export type CertificateStore = {

    /**
     * Insert a certificate
     */
    set: (key: string, data: any) => Promise<CertificateStoreItem>,

    /**
     * Remove a certificate
     */
    remove: (key: string) => Promise<void>,

    /**
     * Remove a certificate
     */
    get<T = CertificateStoreItem>(key: string): Promise<T>,

    /**
     * update certificate info (used when renewing certificate)
     */
    // update: (key: string, data: any) => Promise<CertificateStoreItem>,

    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate: (date: number) => Promise<CertificateStoreItem[]>
}