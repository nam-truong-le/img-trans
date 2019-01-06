"use strict";

const chai = require("chai");
chai.should();
const migration = require("../src/migration");
const path = require("path");
const fs = require("fs-extra");

const TEMP_DIR = path.join(__dirname, "__TMP__");

describe("migration", () => {

    beforeEach(() => {
        fs.removeSync(TEMP_DIR);
    });

    afterEach(() => {
        fs.removeSync(TEMP_DIR);
    });

    it("test", async function() {
        fs.copySync(path.join(__dirname, "data/DSC04815.jpg"), path.join(TEMP_DIR, "source", "DSC04815.jpg"));
        await migration.migrate(path.join(TEMP_DIR, "source"), path.join(TEMP_DIR, "target"));

        fs.existsSync(path.join(TEMP_DIR, "source", "DSC04815.jpg")).should.equal(false);
        fs.existsSync(path.join(TEMP_DIR, "target", "2017", "2", "14", "DSC04815.jpg")).should.equal(true);
    });

    it("don't move", async function() {
        fs.copySync(path.join(__dirname, "data/DSC04815.jpg"), path.join(TEMP_DIR, "source", "DSC04815.jpg"));
        await migration.migrate(path.join(TEMP_DIR, "source"), path.join(TEMP_DIR, "target"), false);

        fs.existsSync(path.join(TEMP_DIR, "source", "DSC04815.jpg")).should.equal(true);
        fs.existsSync(path.join(TEMP_DIR, "target", "2017", "2", "14", "DSC04815.jpg")).should.equal(true);
    });

    it("not valid", async function() {
        fs.copySync(path.join(__dirname, "data/perfect.pdf"), path.join(TEMP_DIR, "source", "perfect.pdf"));
        await migration.migrate(path.join(TEMP_DIR, "source"), path.join(TEMP_DIR, "target"));

        fs.existsSync(path.join(TEMP_DIR, "source", "perfect.pdf")).should.equal(true);
        fs.existsSync(path.join(TEMP_DIR, "target", "2017", "2", "14", "perfect.pdf")).should.equal(false);
    });
});
