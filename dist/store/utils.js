"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFutureDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
exports.getFutureDate = getFutureDate;
