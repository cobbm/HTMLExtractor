const fs = require("fs");
const extractor = require("./HTMLExtractor.js");
const schemas = require("./schemas.js")

function debug() {
    const FILE_PATH = "tmp/bbc-world.html";

    const html = fs.readFileSync(FILE_PATH);

    const json = extractor.extract(html, schemas.bbcNewsTest);

    console.dir(json, { depth: null });
}

debug();
