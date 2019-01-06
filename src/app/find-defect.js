"use strict";

const inquirer = require("inquirer");
const winston = require("winston");
const chalk = require("chalk");
const findDefect = require("../find-defect");

module.exports = async () => {
    try {
        const { sourceDirectory, targetDirectory, move } = await inquirer.prompt([{
            type: "input",
            name: "sourceDirectory",
            message: "Source directory"
        }, {
            type: "input",
            name: "targetDirectory",
            message: "Target directory"
        }, {
            type: "confirm",
            name: "move",
            message: "Move",
            default: true
        }]);

        await findDefect.findDefect(sourceDirectory, targetDirectory, move);
    } catch (error) {
        winston.error(chalk.red(error));
    }
};
