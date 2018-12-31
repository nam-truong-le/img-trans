"use strict";

const exifTool = require("exiftool");
const fs = require("fs");
const moment = require("moment");
const config = require("config");

const CREATE_DATE_TAGS = config.get("metadata.createDateTags");
const ALLOWED_FILE_TYPES = config.get("metadata.allowedFileTypes");

const createdDate = path => {
    return new Promise((resolve, reject) => {
        exifTool.metadata(fs.readFileSync(path), (error, metadata) => {
            if (error) {
                reject(error);
            } else {
                const fileType = metadata["fileType"];
                if (ALLOWED_FILE_TYPES.includes(fileType)) {
                    let createdDateString;

                    for (let tag of CREATE_DATE_TAGS) {
                        if (metadata.hasOwnProperty(tag)) {
                            createdDateString = metadata[tag];
                        }
                    }

                    if (!createdDateString) {
                        reject("Could not parse exif info");
                    } else {
                        resolve(moment.utc(createdDateString, "YYYY:MM:DD HH:mm:ss"));
                    }
                } else {
                    reject(`File type '${fileType}' not supported`);
                }
            }
        });
    });
};

module.exports = {
    createdDate
};
