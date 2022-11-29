const fs = require("fs");
const extractor = require("./HTMLExtractor.js");

const schemas = require("./schemas.js")(extractor);

function debug() {
    const FILE_PATH = "bbcNews.html";

    const html = fs.readFileSync(FILE_PATH);

    const json = extractor.extract(html, schemas.bbcNews);

    console.dir(json, { depth: null });
}

debug();
