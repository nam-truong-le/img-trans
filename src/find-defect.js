"use strict";

const winston = require("winston");
const chalk = require("chalk");
const path = require("path");
const fileUtils = require("./file");
const meta = require("./metadata");

module.exports = {
    findDefect
};

async function checkFile (filePath, targetDirectory, move) {
    winston.info(chalk.blue(`Process ${filePath}`));
    const paths = filePath.split(path.sep);
    const fileName = paths.pop();
    const dayInPath = Number.parseInt(paths.pop(), 10);
    const monthInPath = Number.parseInt(paths.pop(), 10);
    const yearInPath = Number.parseInt(paths.pop(), 10);

    try {
        const createdDate = await meta.createdDate(filePath);
        if (yearInPath !== createdDate.year() || monthInPath !== createdDate.month() + 1 || dayInPath !== createdDate.date()) {
            winston.info(chalk.yellow(`   ${fileName} defect, will be moved to ${targetDirectory}`));
            fileUtils.moveFile(filePath, path.join(targetDirectory, fileName), move);
        } else {
            winston.info(chalk.gray("   OK"));
        }
    } catch (error) {
        winston.info(chalk.red(`   ${fileName} with error '${error}', will be moved to ${targetDirectory}`));
        fileUtils.moveFile(filePath, path.join(targetDirectory, fileName), move);
    }
}

async function findDefect(sourceDirectory, targetDirectory, move = true) {
    await fileUtils.processFiles(sourceDirectory, filePath => function(done) {
        checkFile(filePath, targetDirectory, move).then(() => {
            done();
        }).catch(error => done(error || "Unknown Error"));
    });
}
