"use strict";

const chai = require("chai");
chai.should();
const fileUtils = require("../src/file");
const fs = require("fs-extra");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "__tmp__");
const sourcePath = path.join(TEMP_DIR, "source", "foo.txt");
const targetPath = path.join(TEMP_DIR, "target", "foo.txt");
const targetPath1 = path.join(TEMP_DIR, "target", "foo_diff.txt");
const targetPath2 = path.join(TEMP_DIR, "target", "foo_diff_diff.txt");

describe("file", () => {
    beforeEach(() => {
        fs.removeSync(TEMP_DIR);
        fs.ensureDirSync(path.join(TEMP_DIR, "source"));
        fs.ensureDirSync(path.join(TEMP_DIR, "target"));
    });

    afterEach(() => {
        fs.removeSync(TEMP_DIR);
    });

    it("target not exist", () => {
        fs.writeFileSync(sourcePath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });

    it("only copy", () => {
        fs.writeFileSync(sourcePath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath, false);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(true);
    });

    it("target exists, same file", () => {
        fs.writeFileSync(sourcePath, "Foo");
        fs.writeFileSync(targetPath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });

    it("target exists, different file", () => {
        fs.writeFileSync(sourcePath, "Foo");
        fs.writeFileSync(targetPath, "Bar");
        fs.writeFileSync(targetPath1, "Boo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Bar");
        fs.readFileSync(targetPath1).toString().should.equal("Boo");
        fs.readFileSync(targetPath2).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });
});
