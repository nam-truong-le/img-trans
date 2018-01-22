"use strict";

const walk = require("klaw");
const winston = require("winston");
const chalk = require("chalk");
const fs = require("fs-extra");
const metadata = require("./metadata");
const path = require("path");

const migrateSingleFile = (file, targetDirectory, move) => {
    const createdDate = metadata.createdDate(file);
    const year = createdDate.year();
    const month = createdDate.month();
    const date = createdDate.date();

    const finalDirectory = path.join(targetDirectory, `${year}`, `${month + 1}`, `${date}`);
    fs.ensureDirSync(finalDirectory);

    if (move) {
        fs.moveSync(file, path.join(finalDirectory, path.basename(file)));
    } else {
        fs.copySync(file, path.join(finalDirectory, path.basename(file)));
    }
};

const migrate = async (sourceDirectory, targetDirectory, move = true) => {
    fs.ensureDirSync(targetDirectory);

    return new Promise((resolve, reject) => {
        walk(sourceDirectory)
            .on("data", item => {
                if (item.stats.isFile()) {
                    winston.info(chalk.gray(item.path));
                    migrateSingleFile(item.path, targetDirectory, move);
                }
            })
            .on("end", () => {
                resolve();
            })
            .on("error", reject)
    });
};

module.exports = {
    migrate
};
