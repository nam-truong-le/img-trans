"use strict";

const walk = require("klaw");
const winston = require("winston");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const PQueue = require("p-queue");
const queue = new PQueue({concurrency: 1});

const checkFile = async (filePath, targetDirectory, move) => {
    const paths = filePath.split(path.sep);
    paths.pop();
    const day = paths.pop();
    const month = paths.pop();
    const year = paths.pop();
};

const findDefect = async (sourceDirectory, targetDirectory, move = true) => {
    fs.ensureDirSync(targetDirectory);

    return new Promise((resolve, reject) => {
        walk(sourceDirectory)
            .on("data", item => {
                if (item.stats.isFile() && !path.basename(item.path).startsWith(".")) {
                    queue.add(() => checkFile(item.path, targetDirectory, move));
                } else {
                    winston.info(chalk.yellow(`   skipped file '${item.path}'`));
                }
            })
            .on("end", () => {
                queue.onEmpty().then(resolve);
            })
            .on("error", reject);
    });
};

module.exports = {
    findDefect
};
