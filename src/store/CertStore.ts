import KnexCertStore from "../modules/cert-store";
// import getAcmePath from "../pathUtils";



let _certStore: KnexCertStore;// = new KnexCertStore(getAcmePath("certStore"));

const CertStore = {
    
    getStore: () => {
       return _certStore;
    },

    setStore: (store: KnexCertStore) => {
        _certStore = store;
    }
}

export default CertStore;
