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
    });

    afterEach(() => {
        fs.removeSync(TEMP_DIR);
    });

    it("target not exist", () => {
        fs.outputFileSync(sourcePath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });

    it("only copy", () => {
        fs.outputFileSync(sourcePath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath, false);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(true);
    });

    it("target exists, same file", () => {
        fs.outputFileSync(sourcePath, "Foo");
        fs.outputFileSync(targetPath, "Foo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });

    it("target exists, different file", () => {
        fs.outputFileSync(sourcePath, "Foo");
        fs.outputFileSync(targetPath, "Bar");
        fs.outputFileSync(targetPath1, "Boo");

        fileUtils.moveFile(sourcePath, targetPath);
        fs.readFileSync(targetPath).toString().should.equal("Bar");
        fs.readFileSync(targetPath1).toString().should.equal("Boo");
        fs.readFileSync(targetPath2).toString().should.equal("Foo");
        fs.existsSync(sourcePath).should.equal(false);
    });

    it("process files", async () => {
        fs.outputFileSync(path.join(TEMP_DIR, "source", "dir1", "foo.txt"), "Foo");
        fs.outputFileSync(path.join(TEMP_DIR, "source", "dir2", "bar.txt"), "Bar");
        fs.outputFileSync(path.join(TEMP_DIR, "source", "dir2", ".ignore.txt"), "Ignore");

        const processed = [];
        await fileUtils.processFiles(path.join(TEMP_DIR, "source"), filePath => function(done) {
            processed.push(filePath);
            done();
        });

        processed.length.should.equal(2);
        processed.includes(path.join(TEMP_DIR, "source", "dir1", "foo.txt")).should.equal(true);
        processed.includes(path.join(TEMP_DIR, "source", "dir2", "bar.txt")).should.equal(true);
    });
});
