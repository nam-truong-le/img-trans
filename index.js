"use strict";

const inquirer = require("inquirer");
const LOG = require("winston");

const P_MAP = new Map([
    ["Transport images", "./src/app/migration.js"],
    ["Remove duplicates", "./src/app/clean.js"],
    ["Find defects", "./src/app/find-defect.js"]
]);

(async function() {
    const { program } = await inquirer.prompt([{
        type: "list",
        name: "program",
        message: "Please choose program to run!",
        choices: [...P_MAP.keys()]
    }]);

    try {
        await require(P_MAP.get(program))();
    } catch (e) {
        LOG.error(e);
    }
})();
