import { CertificateStore } from "./types";
declare const CertStore: {
    getStore: () => CertificateStore;
    setStore: (store: CertificateStore) => void;
};
export default CertStore;
