"use strict";

const winston = require("winston");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const walk = require("klaw");
const async = require("async");

module.exports = {
    moveFile,
    processFiles,
    processDirectories
};

function moveFile(filePath, targetFilePath, move = true) {
    winston.info(chalk.green(`   targeting '${targetFilePath}'...`));

    if (fs.existsSync(targetFilePath)) {
        winston.info(chalk.green(`   ${targetFilePath} exists`));
        const fileBuff = fs.readFileSync(filePath);
        const targetFileBuff = fs.readFileSync(targetFilePath);
        if (fileBuff.equals(targetFileBuff)) {
            // files are same
            winston.info(chalk.green("   files are same"));
            if (move) {
                winston.info(chalk.green(`   source file '${filePath}' will be removed`));
                fs.removeSync(filePath);
            }
        } else {
            const extension = path.extname(targetFilePath);
            const newTargetFile = path.join(path.dirname(targetFilePath), `${path.basename(targetFilePath, extension)}_diff${extension}`);
            // files are different but same name
            winston.info(chalk.green(`   targeting to new location ${newTargetFile}`));
            moveFile(filePath, newTargetFile, move);
        }
    } else {
        if (move) {
            fs.moveSync(filePath, targetFilePath);
        } else {
            fs.copySync(filePath, targetFilePath);
        }
    }
}

async function processDirectories(dirPath, processFactory) {
    await _processItems(dirPath, item => item.stats.isDirectory(), processFactory);
}

async function processFiles(dirPath, processFactory, depthLimit) {
    await _processItems(dirPath, item => item.stats.isFile() && !path.basename(item.path).startsWith("."), processFactory, depthLimit);
}

async function _processItems(dirPath, filter, processFactory, depthLimit) {
    const items = [];
    await new Promise((resolve, reject) => {
        walk(dirPath, {
            depthLimit
        }).on("data", item => {
            if (filter(item)) {
                items.push(item.path);
            }
        }).on("end", () => {
            resolve();
        }).on("error", reject);
    });

    await new Promise((resolve, reject) => {
        async.series(items.map(processFactory), (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
