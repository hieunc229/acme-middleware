import path from "path";

const acmePath = process.env.ACME_EXPRESS_PATH || `/acme-express/certs`;

export default function getAcmePath(...paths: string[]) {
    return path.join(acmePath, ...paths);
}
