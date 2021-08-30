"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import getAcmePath from "../pathUtils";
let _certStore; // = new KnexCertStore(getAcmePath("certStore"));
const CertStore = {
    getStore: () => {
        return _certStore;
    },
    setStore: (store) => {
        _certStore = store;
    }
};
exports.default = CertStore;
