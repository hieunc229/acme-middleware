"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function dirCheckup() {
    const aePath = process.env.ACME_EXPRESS_PATH;
    if (!aePath) {
        return false;
    }
    if (!fs_1.default.existsSync(aePath)) {
        try {
            fs_1.default.mkdirSync(aePath);
        }
        catch (err) {
            console.warn(`Unable to create working directory at ${aePath}. You need to create it yourself`);
            return false;
        }
    }
    if (!fs_1.default.existsSync(path_1.default.join(aePath, "acme-challenge"))) {
        try {
            fs_1.default.mkdirSync(path_1.default.join(aePath, "acme-challenge"));
        }
        catch (err) {
            console.warn(`Unable to create acme-challenge directory at ${path_1.default.join(aePath, "acme-challenge")}. You need to create it yourself`);
            return false;
        }
    }
}
exports.dirCheckup = dirCheckup;
