import fs from "fs";
import acme from "acme-client";
import getAcmePath from "../pathUtils";
import certificate from "./certificate";

export async function checkDefaultCert(certhPath: string, keyPath: string) {

    if (!fs.existsSync(certhPath) || !fs.existsSync(keyPath)) {

        // https://github.com/publishlab/node-acme-client/blob/master/docs/forge.md#createCsr
        const privateKey = await acme.forge.createPrivateKey();
        const publicKey = await acme.forge.createPublicKey(privateKey);

        const [_, certificateCsr] = await acme.forge.createCsr({
            commonName: 'localhost',
            altNames: ['localhost']
        }, privateKey);



        await certificate.save("default", `key.pem`, publicKey);
        await certificate.save('default', `cert.pem`, certificateCsr);
        await certificate.save('default', `generatedPrivateKey.pem`, privateKey);

        // fs.writeFileSync(getAcmePath("./generatedPrivateKey.pem"), privateKey);
        // fs.writeFileSync(certhPath, certificateCsr);
        // fs.writeFileSync(keyPath, publicKey);
    }
}

