/// <reference types="node" />
import tls from "tls";
export declare function loadCert(servername: string, email?: string): Promise<tls.SecureContext>;
