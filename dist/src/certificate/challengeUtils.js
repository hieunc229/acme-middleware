"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChallenge = exports.createChallenge = void 0;
const fs_1 = __importDefault(require("fs"));
const pathUtils_1 = __importDefault(require("../pathUtils"));
function createChallenge(clientToken, accountToken) {
    fs_1.default.writeFileSync(pathUtils_1.default(`acme-challenge`, clientToken), `${accountToken}`);
}
exports.createChallenge = createChallenge;
function removeChallenge(clientToken) {
    fs_1.default.unlinkSync(pathUtils_1.default(`acme-challenge`, clientToken));
}
exports.removeChallenge = removeChallenge;
