
export function getAuthIdentifiers(domain: string, altNames?: string[]) {

    let identifiers = [{ type: 'dns', value: domain }];

    altNames && (identifiers = identifiers.concat(
        altNames.map(value => {
            return { type: 'dns', value };
        })
    ));

    return identifiers
}