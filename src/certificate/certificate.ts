import fs from "fs";
import getAcmePath from "../pathUtils";

function remove(domain: string) {
    fs.unlinkSync(getAcmePath(domain, `key.pem`))
    fs.unlinkSync(getAcmePath(domain, `cert.pem`))
}

function save(domain: string, fileName: string, content: Buffer | string) {

    const dir = getAcmePath(domain);

    console.log("[save]", dir)

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(getAcmePath(domain, fileName), content);
}

function load(domain: string, fileName: string) {
    const dir = getAcmePath(domain);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    return fs.readFileSync(getAcmePath(domain, fileName));
}

function exists(domain: string, fileName: string) {
    return fs.existsSync(getAcmePath(domain, fileName));
}

const certificate = {
    save,
    load,
    exists,
    remove
}

export default certificate;