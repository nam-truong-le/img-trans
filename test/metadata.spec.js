"use strict";

const chai = require("chai");
chai.should();
const path = require("path");
const winston = require("winston");
const chalk = require("chalk");

const metadata = require("../src/metadata");

describe("metadata", () => {
    it("jpg", async () => {
        const createdDate = await metadata.createdDate(path.join(__dirname, "data/DSC04815.jpg"));
        winston.info(chalk.gray(JSON.stringify(createdDate)));
        createdDate.format().should.equal("2017-02-14T19:08:08Z");
    });

    it("raw", async () => {
        const createdDate = await metadata.createdDate(path.join(__dirname, "data/DSC02613.ARW"));
        winston.info(chalk.gray(JSON.stringify(createdDate)));
        createdDate.format().should.equal("2016-01-01T00:05:01Z");
    });

    it("pdf", async () => {
        try {
            const createdDate = await metadata.createdDate(path.join(__dirname, "data/perfect.pdf"));
            return Promise.reject("Should reject");
        } catch (error) {
            return Promise.resolve();
        }
    });

    it("mov", async () => {
        const createdDate = await metadata.createdDate(path.join(__dirname, "data/IMG_0624.MOV"));
        winston.info(chalk.gray(JSON.stringify(createdDate)));
        createdDate.format().should.equal("2018-11-14T22:14:34Z");
    });

    it("mp4", async () => {
        const createdDate = await metadata.createdDate(path.join(__dirname, "data/test1.MP4"));
        createdDate.format().should.equal("2018-01-24T17:31:12Z");
    })

    it("png", async () => {
        const createdDate = await metadata.createdDate(path.join(__dirname, "data/IMG_5147.PNG"));
        createdDate.format().should.equal("2018-01-27T15:24:10Z");
    });
});
