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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderInfoHandler = void 0;
const order_1 = require("../functions/order");
/**
 * Get info of an existing challenge
 * @param req
 * @param res
 * @returns
 */
function orderInfoHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const domain = req.query.domain || req.hostname;
        order_1.getOrder(domain, process.env.ACME_EXPRESS_EMAIL || "sample@notrealdomain.com")
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                status: 'ok',
                data
            });
        }))
            .catch(err => {
            res.status(500).json({
                status: 'error',
                domain,
                message: err.toString()
            });
        });
    });
}
exports.orderInfoHandler = orderInfoHandler;
