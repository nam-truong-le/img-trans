"use strict";

const inquirer = require("inquirer");
const removeDuplicate = require("../remove-duplicate");
const fileUtils = require("../file");
const winston = require("winston");
const chalk = require("chalk");

module.exports = async () => {
    const { directory } = await inquirer.prompt([{
        type: "input",
        name: "directory",
        message: "Directory"
    }]);

    await fileUtils.processDirectories(directory, dirPath => function(done) {
        winston.info(chalk.blue(`Process dir '${dirPath}'`));
        removeDuplicate.removeDuplicate(dirPath).then(() => {
            done();
        }).catch(error => {
            done(error || "Unknown Error");
        });
    });
};
