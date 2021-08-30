import acme from "acme-client";
import fs from "fs";

import getAcmePath from "../pathUtils";

let accountKey: Buffer | undefined;

async function getOrCreateKey(): Promise<[Buffer, boolean]> {

    let created = false;
    if (accountKey) {
        return Promise.resolve([accountKey, created]);
    }

    const keyPath = getAcmePath("accountKey.pem");

    if (!fs.existsSync(keyPath)) {
        let strBuff = await acme.forge.createPrivateKey();
        fs.writeFileSync(keyPath, strBuff);
        accountKey = strBuff;
        created = false;
    } else {
        accountKey = fs.readFileSync(keyPath);
    }

    return [accountKey, created];
}

export async function getClient(email: string) {

    const [accountKey, created] = await getOrCreateKey()

    /* Init client */
    const client = new acme.Client({
        directoryUrl: process.env.ACME_EXPRESS_PRODUCTION === "true" ? acme.directory.letsencrypt.production : acme.directory.letsencrypt.staging,
        accountKey
    });

    if (!created) {
        /* Register account */
        await client.createAccount({
            termsOfServiceAgreed: true,
            contact: [`mailto:${email}`]
        });
    }

    return client;
}