"use strict";

const inquirer = require("inquirer");
const removeDuplicate = require("../remove-duplicate");
const fileUtils = require("../file");
const winston = require("winston");
const chalk = require("chalk");
const fs = require("fs-extra");

const REPORT = "target/clean.txt";

module.exports = async () => {
    const { directory } = await inquirer.prompt([{
        type: "input",
        name: "directory",
        message: "Directory"
    }]);

    fs.removeSync(REPORT);
    fs.outputFileSync(REPORT, "");

    await fileUtils.processDirectories(directory, dirPath => function(done) {
        winston.info(chalk.blue(`Process dir '${dirPath}'`));
        removeDuplicate.removeDuplicate(dirPath).then((result) => {
            fs.appendFileSync(REPORT, `\n${result.path}\n   ${result.removed}/${result.total}`);
            done();
        }).catch(error => {
            fs.appendFileSync(REPORT, `ERROR at '${dirPath}': ${error}`);
            done(error || "Unknown Error");
        });
    });
};
