"use strict";

const migration = require("../src/migration");
const path = require("path");

describe("migration", () => {
    it("test", async () => {
        await migration.migrate(path.join(__dirname, "data"), path.join(__dirname, "data_migrated"), false);
    });
});
