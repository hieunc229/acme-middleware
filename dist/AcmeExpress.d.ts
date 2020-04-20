/// <reference types="node" />
import express from "express";
import https from "https";
export declare class AcmeExpress {
    private app;
    private https;
    constructor(app: any);
    private initate;
    getApp(): express.Express;
    listen(opts?: {
        host?: string;
        port?: number;
    } | Function, callback?: Function): {
        http: import("http").Server;
        https: https.Server;
    };
}
