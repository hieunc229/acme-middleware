import fs from "fs";
import acme from "acme-client";

export async function checkDefaultCert(certhPath: string, keyPath: string) {

    if (!fs.existsSync(certhPath) || !fs.existsSync(keyPath)) {


        // generate an RSA key pair synchronously
        // *NOT RECOMMENDED*: Can be significantly slower than async and may block
        // JavaScript execution. Will use native Node.js 10.12.0+ API if possible.
        const privateKey = await acme.forge.createPrivateKey();

        const [certificateKey, certificateCsr] = await acme.openssl.createCsr({
            commonName: 'localhost',
            altNames: ['localhost']
        });

        acme.openssl.createPublicKey

        fs.writeFileSync(certhPath, certificateKey);
        fs.writeFileSync(keyPath, privateKey);
    }
}

