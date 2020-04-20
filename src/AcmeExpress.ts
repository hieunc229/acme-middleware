import express, { Express } from "express";
import createSSLServer from "./https";
import https from "https";
import getAcmePath from "./pathUtils";

export class AcmeExpress {

    private app: Express;
    private https: https.Server;

    constructor(app: any) {
        this.app = app;
        this.https = createSSLServer(app);
        this.initate();
    }

    private initate = () => {
        this.app.use(
            '/.well-known/acme-challenge',
            express.static(getAcmePath('acme-challenge'))
        );
    }

    getApp() {
        return this.app;
    }

    listen(opts?: { host?: string, port?: number } | Function, callback?: Function) {

        let { host, port } = Object.assign({ host: 'localhost', port: 80 }, opts);

        let fn = (typeof opts === "function" ? opts : callback);

        return {
            // @ts-ignore
            http: this.app.listen(port, host, () => fn && fn({ host, port })),
            // @ts-ignore
            https: this.https.listen(443, host, () => fn && fn({ host, port: 443 }))
        };
    }
}