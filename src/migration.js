"use strict";

const winston = require("winston");
const chalk = require("chalk");
const metadata = require("./metadata");
const path = require("path");
const fileUtils = require("./file");

module.exports = {
    migrate
};

async function migrateSingleFile (file, targetDirectory, move) {
    winston.info(chalk.blue(`Move '${file}' to ${targetDirectory}`));

    try {
        const createdDate = await metadata.createdDate(file);
        const year = createdDate.year();
        const month = createdDate.month();
        const date = createdDate.date();

        const finalDirectory = path.join(targetDirectory, `${year}`, `${month + 1}`, `${date}`);

        const targetFile = path.join(finalDirectory, path.basename(file));
        fileUtils.moveFile(file, targetFile, move);
    } catch (error) {
        winston.warn(chalk.yellow(`   skipped because of '${error}'`));
    }
}

async function migrate (sourceDirectory, targetDirectory, move = true) {
    await fileUtils.processFiles(sourceDirectory, filePath => function(done) {
        migrateSingleFile(filePath, targetDirectory, move).then(() => {
            done();
        }).catch(error => {
            done(error || "Unknown Error");
        });
    });
}
