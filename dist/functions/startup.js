"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const cron_1 = require("cron");
const list_1 = require("./list");
const renew_1 = require("./renew");
let cron;
/**
 * Check for exi
 */
function startup() {
    // init cron;
    cron = new cron_1.CronJob("0 0 1 * *", checkup);
}
exports.startup = startup;
function checkup() {
    list_1.listExpiredDomains()
        .then(renewList)
        .catch(err => {
        console.log("[ERROR] Failed to list domains for cron checkup", err);
    });
}
function renewList(items) {
    let item, domain, altNames;
    function run(i) {
        if (items.length > i) {
            item = items[i];
            domain = item.id;
            altNames = item.altNames;
            renew_1.renewDomain({ domain, altNames })
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
    run(0);
}
