import getAcmePath from "../pathUtils";

import { CertificateStore } from "./types";
import { FsCertStore } from "./fs-store-driver";

let _certStore: CertificateStore = new FsCertStore({
    path: getAcmePath("certStore")
 });

const CertStore = {
    
    getStore: () => {
       return _certStore;
    },

    setStore: (store: CertificateStore) => {
        _certStore = store;
    }
}

export default CertStore;
