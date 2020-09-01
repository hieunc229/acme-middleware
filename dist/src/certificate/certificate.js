"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pathUtils_1 = __importDefault(require("../pathUtils"));
function save(domain, fileName, content) {
    const dir = pathUtils_1.default(domain);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    fs_1.default.writeFileSync(pathUtils_1.default(domain, fileName), content);
}
function load(domain, fileName) {
    const dir = pathUtils_1.default(domain);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    return fs_1.default.readFileSync(pathUtils_1.default(domain, fileName));
}
function exists(domain, fileName) {
    return fs_1.default.existsSync(pathUtils_1.default(domain, fileName));
}
const certificate = {
    save,
    load,
    exists
};
exports.default = certificate;
