"use strict";

const fileUtils = require("./file");
const MD5 = require("md5.js");
const winston = require("winston");
const fs = require("fs-extra");
const _ = require("lodash");

module.exports = {
    removeDuplicate
};

async function removeDuplicate(dirPath) {
    const files = [];

    await fileUtils.processFiles(dirPath, filePath => function(done) {
        winston.info(`   hash ${filePath}...`);
        files.push({
            path: filePath,
            hash: new MD5().update(fs.readFileSync(filePath)).digest("hex")
        });
        done();
    }, 0);

    let count = 0;
    const filesGroupByHash = _.groupBy(files, "hash");
    for (const hash in filesGroupByHash) {
        winston.info(`   process hash ${hash}`);
        filesGroupByHash[hash].forEach((f, i) => {
            if (i === 0) {
                winston.info(`    keep ${f.path}`);
            } else {
                winston.info(`    delete ${f.path}`);
                fs.removeSync(f.path);
                count++;
            }
        });
    }

    winston.info(`   Finished. ${count} files deleted from ${files.length}.`);
}
