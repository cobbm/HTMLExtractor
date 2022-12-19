const jsdom = require("jsdom");

function process(element, schemaEl) {
    var e = null;
    var hasTransform = false;
    var ch = null;
    var hasChildren = false;
    if (element == null)
        return null;

    if (typeof schemaEl.skip == "function") {
        if (schemaEl.skip(element))
            return undefined;
    }
    if (typeof schemaEl.transform == "function") {
        hasTransform = true;
        e = schemaEl.transform(element);
    }
    if (typeof schemaEl.children != "undefined" && Array.isArray(schemaEl.children)) {
        hasChildren = true;
        ch = reduceChildren(element, schemaEl.children, {});
    }
    var r = {};
    if (hasTransform) {
        if (hasChildren) {
            r.result = e;
            r.children = ch;
        } else {
            r = e;
        }
    } else {
        if (hasChildren) {
            r = ch;
        } else {
            r = null;
        }
    }
    return r;
}

function extractElement(element, schemaEl) {
    if (typeof schemaEl.select != "undefined") {
        const matched = element.querySelector(schemaEl.select);
        return process(matched, schemaEl);
    } else if (typeof schemaEl.selectAll != "undefined") {
        const matched = Array.from(element.querySelectorAll(schemaEl.selectAll));
        return matched.map((v, i) => {
            return process(v, schemaEl);
        }).filter((x) => typeof (x) !== "undefined")
    } else {
        throw new Error(`Schema must contain either 'select' or 'selectAll'!`);
    }
}

function reduceChildren(element, schemaArr, obj) {
    function reduceImpl(prev, curr, idx, arr) {
        const name = curr.name ?? "element";
        const r = extractElement(element, curr);
        if (typeof (r) !== "undefined") {
            if (typeof prev[name] == "undefined") {
                prev[name] = r;
            }
            else if (typeof prev[name] == "object") {
                //object with given key already exists in result object!
                if (!Array.isArray(prev[name])) {
                    prev[name] = [prev[name]];
                }
                if (Array.isArray(r)) {
                    prev[name] = prev[name].concat(r);
                } else {
                    prev[name].push(r);
                }
            }
        }
        return prev;
    }
    return schemaArr.reduce(reduceImpl, obj);
}

function extract(htmlString, schema) {
    const dom = new jsdom.JSDOM(htmlString);
    var rootEl = dom.window.document.querySelector(":root");
    var s;
    if (!Array.isArray(schema)) {
        s = [schema];
    } else {
        s = schema;
    }
    return reduceChildren(rootEl, s, {});
}

function getTextContent(el) {
    return el.textContent;
}

// taken from https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
function getTextContentNormalised(el) {
    let data = getTextContent(el);
    data = data.replace(/[\t\n\r ]+/g, " ");
    if (data[0] === " ") {
        data = data.substring(1, data.length);
    }
    if (data[data.length - 1] === " ") {
        data = data.substring(0, data.length - 1);
    }
    return data;
}

module.exports = {
    extract,
    extractElement,
    helpers: {
        getTextContent,
        getTextContentNormalised,
    },
};
