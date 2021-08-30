"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthIdentifiers = void 0;
function getAuthIdentifiers(domain, altNames) {
    let identifiers = [{ type: 'dns', value: domain }];
    altNames && (identifiers = identifiers.concat(altNames.map(value => {
        return { type: 'dns', value };
    })));
    return identifiers;
}
exports.getAuthIdentifiers = getAuthIdentifiers;
