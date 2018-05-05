"use strict";

const walk = require("klaw");
const LOG = require("winston");
const inquirer = require("inquirer");
const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const MD5 = require("md5.js");

module.exports = async () => {
    const { directory } = await inquirer.prompt([{
        type: "input",
        name: "directory",
        message: "Directory"
    }]);

    const files = [];

    return new Promise((resolve, reject) => {
        walk(directory)
            .on("data", item => {
                if (item.stats.isFile() && !path.parse(item.path).base.startsWith(".")) {
                    files.push({
                        path: item.path
                    });
                }
            })
            .on("end", resolve)
            .on("error", errorHandler(reject));
    }).then(() => {
        return removeDuplicates(files);
    });
};

function removeDuplicates(files) {
    let count = 0;

    return new Promise((resolve) => {
        files.forEach(file => {
            file.hash = new MD5().update(fs.readFileSync(file.path)).digest("hex");
            LOG.info(`file ${file.path} --> ${file.hash}`);
        });
        const filesGroupByHash = _.groupBy(files, "hash");
        for (const hash in filesGroupByHash) {
            LOG.info(`process hash ${hash}`);
            filesGroupByHash[hash].forEach((f, i) => {
                if (i === 0) {
                    LOG.info(`    keep ${f.path}`);
                } else {
                    LOG.info(`    delete ${f.path}`);
                    fs.removeSync(f.path);
                    LOG.info("        deleted!");
                    count++;
                }
            });
        }

        LOG.info(`Finished. ${count} files deleted from ${files.length}.`);

        resolve();
    });
}

function errorHandler(reject) {
    return error => {
        LOG.error(error);
        reject(error);
    };
}