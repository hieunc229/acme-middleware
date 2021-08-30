import KnexCertStore from "../modules/cert-store";
declare const CertStore: {
    getStore: () => KnexCertStore;
    setStore: (store: KnexCertStore) => void;
};
export default CertStore;
