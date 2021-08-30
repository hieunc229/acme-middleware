
import DNS from "dns"
import { CertChallange } from "./create"

type VerifyResponse = {
    keyAuthorization: string,
    valid: boolean,
    address: string[][]
}

export function verifyDNS(data: CertChallange): Promise<VerifyResponse> {

    return new Promise((resolve, reject) => {

        DNS.resolveTxt(data.challenge.dnsChallengeRecord, (err, address) => {

            if (err) {
                return reject(err);
            }

            resolve({
                keyAuthorization: data.challenge.keyAuthorization,
                valid: address.flat().indexOf(data.challenge.keyAuthorization) !== -1,
                address
            })

        })
    })

}