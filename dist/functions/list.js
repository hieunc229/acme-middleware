"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listExpiredDomains = void 0;
const store_1 = __importDefault(require("../store"));
const utils_1 = require("../store/utils");
function listExpiredDomains(options) {
    let { date = utils_1.getFutureDate(30) } = options || {};
    const store = store_1.default.getStore();
    return store.getExpiredDomainsByDate(date);
}
exports.listExpiredDomains = listExpiredDomains;
