import fs from "fs";
import path from 'path';
import getAcmePath from "../pathUtils";

export function createChallenge(clientToken: string, accountToken: string) {
    fs.writeFileSync(getAcmePath(`acme-challenge`, clientToken), `${accountToken}`);
}

export function removeChallenge(clientToken: string) {

    fs.unlinkSync(getAcmePath(`acme-challenge`, clientToken));

}