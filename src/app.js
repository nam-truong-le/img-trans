"use strict";

const inquirer = require("inquirer");
const winston = require("winston");
const chalk = require("chalk");
const path = require("path");

(async () => {
    try {
        const { sourceDirectory, targetDirectory } = await inquirer.prompt([{
            type: "input",
            name: "sourceDirectory",
            message: "Source directory"
        }, {
            type: "input",
            name: "targetDirectory",
            message: "Target directory"
        }]);

    } catch (error) {
        winston.info(chalk.red(error));
    }
})();
