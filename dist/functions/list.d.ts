import { CertificateStoreItem } from "../store/types";
export declare function listExpiredDomains(options?: {
    date?: Date;
}): Promise<CertificateStoreItem[]>;
