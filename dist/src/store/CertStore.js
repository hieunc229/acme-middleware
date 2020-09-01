"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pathUtils_1 = __importDefault(require("../pathUtils"));
const fs_store_driver_1 = require("./fs-store-driver");
let _certStore = new fs_store_driver_1.FsCertStore({
    path: pathUtils_1.default("certStore")
});
const CertStore = {
    getStore: () => {
        return _certStore;
    },
    setStore: (store) => {
        _certStore = store;
    }
};
exports.default = CertStore;
