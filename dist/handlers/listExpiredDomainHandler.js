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
exports.listExpiredDomainHandler = void 0;
const list_1 = require("../functions/list");
/**
 * Get info of an existing challenge
 * @param req
 * @param res
 * @returns
 */
function listExpiredDomainHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = req.query.date ? new Date(req.query.date) : undefined;
        list_1.listExpiredDomains({ date })
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                status: 'ok',
                data,
            });
        }))
            .catch(err => {
            res.status(500).json({
                status: 'error',
                message: err.toString()
            });
        });
    });
}
exports.listExpiredDomainHandler = listExpiredDomainHandler;
