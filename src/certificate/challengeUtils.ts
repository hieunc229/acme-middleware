import fs from "fs";
import getAcmePath from "../pathUtils";
import { log } from "./utils";

export function createChallenge(clientToken: string, accountToken: string) {
  const path = getAcmePath(`acme-challenge`, clientToken);
  log("[create challege]", path);
  fs.writeFileSync(path, `${accountToken}`);
}

export function removeChallenge(clientToken: string) {

  const path = getAcmePath(`acme-challenge`, clientToken);
  try {
    log("[remove challege]", path);
    fs.unlinkSync(path);
  } catch (err: any) {
    log("Unable to remove challange", err.toString());
  }
}