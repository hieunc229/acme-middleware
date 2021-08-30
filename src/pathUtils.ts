const acmePath = process.env.ACME_EXPRESS_PATH || `./acme-express/certs`;

export default function getAcmePath(...paths: string[]) {
    return [acmePath, ...paths].join("/");
}
