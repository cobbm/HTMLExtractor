const jsdom = require("jsdom");

function processElement(element, schema) {
    if (element == null) return null;
    if (typeof schema.skip == "function") {
        if (schema.skip(element)) return null;
    }
    var el = typeof schema.transform == "function" ? schema.transform(element) : null;

    var children = null;
    if (schema.children && Array.isArray(schema.children)) {
        children = {};
        for (var ch of schema.children) {
            process(children, element, ch);
        }
    }
    if (el != null) {
        if (children != null) {
            return { element: el, children };
        } else {
            return el;
        }
    } else {
        if (children != null) {
            return children;
        } else {
            return null;
        }
    }
}

function process(obj, parentElement, schema) {
    if (schema == null) return null;
    const name = schema.name ?? "element";

    if (schema.select) {
        var e = processElement(parentElement.querySelector(schema.select), schema);
        if (e != null) {
            if (obj[name] != null) {
                if (Array.isArray(obj[name])) {
                    obj[name].push(e);
                } else {
                    throw new Error("Key clash!");
                }
            } else {
                // if(Array.isArray(obj[name]))
                obj[name] = e;
            }
        }
    } else if (schema.selectAll) {
        if (obj[name] == null) obj[schema.name] = [];
        obj[name] = obj[schema.name].concat(
            Array.from(parentElement.querySelectorAll(schema.selectAll))
                .map((x) => processElement(x, schema))
                .filter((x) => x != null)
        );
    } else {
        throw new Error("Invalid Schema!");
    }
    return obj;
}

function extract(htmlString, schema) {
    const dom = new jsdom.JSDOM(htmlString);
    var obj = {};
    var rootEl = dom.window.document.querySelector(":root");
    if (Array.isArray(schema)) {
        for (var s of schema) {
            process(obj, rootEl, s);
        }
    } else {
        process(obj, rootEl, schema);
    }
    return obj;
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
    helpers: {
        getTextContent,
        getTextContentNormalised,
    },
};
