"use strict";

const exifTool = require("exiftool");
const fs = require("fs");
const moment = require("moment");

const createdDate = path => {
    return new Promise((resolve, reject) => {
        exifTool.metadata(fs.readFileSync(path), (error, metadata) => {
            if (error) {
                reject(error);
            } else {
                let createdDateString = metadata["date/timeOriginal"];

                if (!createdDateString) {
                    reject("Could not parse exif info");
                } else {
                    resolve(moment.utc(createdDateString, "YYYY:MM:DD HH:mm:ss"));
                }
            }
        });
    });
};

module.exports = {
    createdDate
};
