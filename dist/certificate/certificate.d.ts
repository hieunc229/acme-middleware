/// <reference types="pouchdb-core" />
/// <reference types="node" />
declare function remove(domain: string): void;
declare function save(domain: string, fileName: string, content: Buffer | string): void;
declare function load(domain: string, fileName: string): Buffer;
declare function exists(domain: string, fileName: string): boolean;
declare const certificate: {
    save: typeof save;
    load: typeof load;
    exists: typeof exists;
    remove: typeof remove;
};
export default certificate;
