import { CertificateStoreItem } from "../store/types";
import CertStore from "../store";
import { getFutureDate } from "../store/utils";

export function listExpiredDomains(options?: { date?: Date }): Promise<CertificateStoreItem[]> {

    let { date = getFutureDate(30) } = options || {};
    const store = CertStore.getStore();
    
    return store.getExpiredDomainsByDate(date)
}