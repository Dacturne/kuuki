"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTime() {
    return new Date().toISOString()
        .replace(/([0-9]){4}(-[0-9]{2}){2}/, '')
        .replace(/T/, '')
        .replace(/\..+/, '');
}
exports.getTime = getTime;
