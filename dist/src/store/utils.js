"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFutureDate = void 0;
function getFutureDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
exports.getFutureDate = getFutureDate;
