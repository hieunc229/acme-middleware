"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../store"));
function infoChallange(opts) {
    const store = store_1.default.getStore();
    return store.get("challenge", opts.domain);
}
exports.default = infoChallange;
