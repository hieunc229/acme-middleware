"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertStore = void 0;
const AcmeExpress_1 = require("./AcmeExpress");
const store_1 = __importDefault(require("./store"));
exports.CertStore = store_1.default;
var createCertHandler_1 = require("./handlers/createCertHandler");
Object.defineProperty(exports, "createCertWithWildcardHandler", { enumerable: true, get: function () { return createCertHandler_1.createCertWithWildcardHandler; } });
exports.default = AcmeExpress_1.AcmeExpress;
