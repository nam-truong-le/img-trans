"use strict";

const chai = require("chai");
chai.should();
const path = require("path");
const fs = require("fs-extra");
const findDetect = require("../src/find-defect");

const TEMP_DIR = path.join(__dirname, "__TMP__");

describe("find-defect", () => {
    beforeEach(() => {
        fs.removeSync(TEMP_DIR);
    });
    afterEach(() => {
        fs.removeSync(TEMP_DIR);
    });

    it("test", async () => {
        fs.copySync(path.join(__dirname, "data/DSC04815.jpg"), path.join(TEMP_DIR, "source", "2017/02/14", "DSC04815.jpg"));
        fs.copySync(path.join(__dirname, "data/DSC02613.ARW"), path.join(TEMP_DIR, "source", "2016/01/03", "DSC02613.ARW"));
        fs.outputFileSync(path.join(TEMP_DIR, "source", "2018/01/01", "foo.txt"), "Foo");

        await findDetect.findDefect(path.join(TEMP_DIR, "source"), path.join(TEMP_DIR, "target"));
        fs.existsSync(path.join(TEMP_DIR, "target", "DSC04815.jpg")).should.equal(false);
        fs.existsSync(path.join(TEMP_DIR, "target", "DSC02613.ARW")).should.equal(true);
        fs.existsSync(path.join(TEMP_DIR, "target", "foo.txt")).should.equal(true);
    });
});
