"use strict";

const chai = require("chai");
chai.should();
const path = require("path");
const fs = require("fs-extra");
const removeDuplicate = require("../src/remove-duplicate");

const TEMP_DIR = path.join(__dirname, "__TMP__");

describe("remove duplicate", () => {
    beforeEach(() => {
        fs.removeSync(TEMP_DIR);
    });
    afterEach(() => {
        fs.removeSync(TEMP_DIR);
    });
    it("test", async () => {
        fs.outputFileSync(path.join(TEMP_DIR, "foo.txt"), "Foo");
        fs.outputFileSync(path.join(TEMP_DIR, "foo1.txt"), "Foo");
        fs.outputFileSync(path.join(TEMP_DIR, "foo2.txt"), "Foo");
        fs.outputFileSync(path.join(TEMP_DIR, "bar.txt"), "Bar");
        fs.outputFileSync(path.join(TEMP_DIR, "bar1.txt"), "Bar");
        fs.outputFileSync(path.join(TEMP_DIR, "boo.txt"), "Boo");

        await removeDuplicate.removeDuplicate(TEMP_DIR);

        let foo = 0;
        ["foo.txt", "foo1.txt", "foo2.txt"].forEach(f => fs.existsSync(path.join(TEMP_DIR, f)) && (foo++));
        let bar = 0;
        ["bar.txt", "bar1.txt"].forEach(f => fs.existsSync(path.join(TEMP_DIR, f)) && (bar++));

        foo.should.equal(1);
        bar.should.equal(1);

        fs.existsSync(path.join(TEMP_DIR, "boo.txt")).should.equal(true);
    });
});
