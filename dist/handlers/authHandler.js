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
exports.authHandler = void 0;
function authHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.ACME_EXPRESS_AUTH_KEY) {
            const auth = req.headers.authorization;
            if (!auth || auth.substr(8) !== process.env.ACME_EXPRESS_AUTH_KEY) {
                return res.status(401).json({
                    status: "failed",
                    message: "unauthorized access"
                });
            }
        }
        next();
    });
}
exports.authHandler = authHandler;
