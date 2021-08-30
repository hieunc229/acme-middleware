"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = void 0;
const client_1 = require("../certificate/client");
const store_1 = __importDefault(require("../store"));
function getOrder(domain, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const store = store_1.default.getStore();
        const client = yield client_1.getClient(email);
        const item = yield store.get("challenge", domain);
        const order = yield client.getOrder(item.order);
        return order;
    });
}
exports.getOrder = getOrder;
