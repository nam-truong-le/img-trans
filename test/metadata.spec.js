"use strict";

const chai = require("chai");
chai.should();
const path = require("path");
const winston = require("winston");
const chalk = require("chalk");

const metadata = require("../src/metadata");

describe("metadata", () => {
    it("test", () => {
        const createdDate = metadata.createdDate(path.join(__dirname, "data/DSC04815.jpg"));
        winston.info(chalk.gray(createdDate));
        createdDate.format().should.equal("2017-02-14T20:08:08+01:00");
    });
});
