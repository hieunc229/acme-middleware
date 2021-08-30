import { Knex } from "knex";
declare type CertificateStoreItem = any;
declare type TableName = "domains" | "challenge";
export default class KnexCertStore {
    private db;
    private onReady?;
    constructor(props: Knex.Config | string, onReady?: Function);
    private t;
    private initate;
    private setupTables;
    get: <T = any>(table: TableName, key: string, options?: {
        jsonProperties: string[];
    } | undefined) => Promise<T>;
    /**
     * Remove a certificate
     */
    remove: (table: TableName, key: string) => Promise<void>;
    /**
     * update certificate info (used when renewing certificate)
     */
    set: (table: TableName, key: string, data: any) => Promise<CertificateStoreItem>;
    /**
     * Get a list of domain that will be expired on or before given date (as in milliseconds)
     */
    getExpiredDomainsByDate<T = CertificateStoreItem[]>(date: Date, options?: {
        page?: number;
        limit?: number;
        jsonProperties?: string[];
    }): Promise<T>;
    destroy(confirm?: boolean): Promise<void>;
}
export {};
