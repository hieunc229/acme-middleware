import { getClient } from "../certificate/client";
import CertStore from "../store";
import { CertChallange } from "./create";

export async function getOrder(domain: string, email: string) {

    const store = CertStore.getStore();
    const client = await getClient(email);
    const item = await store.get<CertChallange>("challenge", domain);
    const order = await client.getOrder(item.order);

    return order
}