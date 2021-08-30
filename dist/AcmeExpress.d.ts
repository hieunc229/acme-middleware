/// <reference types="node" />
import https from "https";
import express, { Express } from "express";
import AcmeDNSClientAbstract from "./modules/dns-client";
export declare const ACME_PATH = "/___acme";
export declare class AcmeExpress {
    private app;
    private https;
    constructor(props: {
        app: any;
        dbPath?: string;
        dnsClient?: AcmeDNSClientAbstract;
    });
    private initiate;
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
    } | Function, callback?: (server: Express | https.Server) => void): {
        http: import("http").Server;
        https: https.Server;
    };
}
