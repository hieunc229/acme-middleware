import fs from "fs";
import acme from "acme-client";
import certificate from "./certificate";
import { log } from "./utils";

export async function checkDefaultCert(certhPath: string, keyPath: string) {

  log("01. Check default Cert", certhPath);

  if (!fs.existsSync(certhPath) || !fs.existsSync(keyPath)) {


    log("02. Default Cert not exists. Create one");

    // https://github.com/publishlab/node-acme-client/blob/master/docs/forge.md#createCsr
    const privateKey = await acme.crypto.createPrivateKey();
    const publicKey = acme.crypto.getPublicKey(privateKey);

    const [_, certificateCsr] = await acme.crypto.createCsr({
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

