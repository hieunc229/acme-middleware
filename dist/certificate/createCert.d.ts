declare type Props = {
    domain: string;
    altNames?: string[];
    email: string;
};
export default function createCert(opts: Props): Promise<void>;
export {};
