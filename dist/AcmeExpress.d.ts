/// <reference types="node" />
import express from "express";
import https from "https";
import { CertificateStore } from "./store/types";
export declare class AcmeExpress {
    private app;
    private https;
    constructor(props: {
        app: any;
        store?: CertificateStore;
    });
    private initate;
    getApp(): express.Express;
    /**
     * Start the server
     * @param opts
     * @param callback
     */
    listen(opts?: {
        host?: string;
        port?: number;
        httpsPort?: number;
    } | Function, callback?: Function): {
        http: import("http").Server;
        https: https.Server;
    };
}
