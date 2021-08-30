"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acmePath = process.env.ACME_EXPRESS_PATH || `./acme-express/certs`;
function getAcmePath(...paths) {
    return [acmePath, ...paths].join("/");
}
exports.default = getAcmePath;
