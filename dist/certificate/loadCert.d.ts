/// <reference types="node" />
import tls from "tls";
export declare function loadCert(domain: string, email: string): Promise<tls.SecureContext>;
