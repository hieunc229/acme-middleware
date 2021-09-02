import fs from "fs";
import getAcmePath from "../pathUtils";

export function createChallenge(clientToken: string, accountToken: string) {
    fs.writeFileSync(getAcmePath(`acme-challenge`, clientToken), `${accountToken}`);
}

export function removeChallenge(clientToken: string) {

    try {
        fs.unlinkSync(getAcmePath(`acme-challenge`, clientToken));
    } catch (err) {
        console.log("Unable to remove challange", err.toString());
    }
}