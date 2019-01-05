"use strict";

const migration = require("../src/migration");
const path = require("path");
const fs = require("fs-extra");

describe("migration", () => {
    it("test", async function() {
        this.timeout(10000);

        const source = path.join(__dirname, "data");
        const target = path.join(__dirname, "data_migrated");
        fs.removeSync(target);

        await migration.migrate(source, target, false);
    });
});
