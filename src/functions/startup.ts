import { CronJob } from "cron";
import { CertificateStoreItem } from "../store/types";
import { listExpiredDomains } from "./list";
import { renewDomain } from "./renew";

let cron: CronJob;

/**
 * Check for exi
 */
export function startup() {

    // init cron;

    cron = new CronJob("0 0 1 * *", checkup)

}

function checkup() {

    listExpiredDomains()
        .then(renewList)
        .catch(err => {
            console.log("[ERROR] Failed to list domains for cron checkup", err);
        })
}

function renewList(items: CertificateStoreItem[]) {

    let item: CertificateStoreItem, domain: string, altNames: string[];

    function run(i: number) {
        if (items.length > i) {
            item = items[i];

            domain = item.id;
            altNames = item.altNames;

            renewDomain({ domain, altNames })
                .then(rs => {

                })
                .catch(err => {

                })
                .finally(() => {
                    run(i + 1);
                });
        }

        i++;
    }

    run(0)
}