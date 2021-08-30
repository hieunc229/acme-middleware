import CertStore from "../store"
import { CertChallange, CreateChallengeProps } from "./create";


export default function infoChallange(opts: CreateChallengeProps) {

    const store = CertStore.getStore();

    return store.get<CertChallange>("challenge", opts.domain)

}