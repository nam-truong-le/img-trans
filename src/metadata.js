"use strict";

const exifParser = require("exif-parser");
const fs = require("fs");
const moment = require("moment");

const exif = path => {
    const parser = exifParser.create(fs.readFileSync(path));
    return parser.parse();
};

const createdDate = path => {
    const tags = exif(path).tags;
    const timeInSecond = tags.DateTimeOriginal || tags.CreateDate;
    if (!timeInSecond) {
        throw "'DateTimeOriginal' & 'CreateDate' undefined.";
    }
    return moment.unix(timeInSecond);
};

module.exports = {
    createdDate
};
