"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const acmePath = process.env.ACME_EXPRESS_PATH || `/acme-express/certs`;
function getAcmePath(...paths) {
    return path_1.default.join(acmePath, ...paths);
}
exports.default = getAcmePath;
