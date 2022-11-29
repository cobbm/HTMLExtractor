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
            return { el, children };
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

    if (schema.select) {
        var e = processElement(parentElement.querySelector(schema.select), schema);
        if (e != null) {
            if (obj[schema.name] != null) {
                if (Array.isArray(obj[schema.name])) {
                    obj[schema.name].push(e);
                } else {
                    throw new Error("Key clash!");
                }
            } else {
                obj[schema.name] = e;
            }
        }
    } else if (schema.selectAll) {
        if (obj[schema.name] == null) obj[schema.name] = [];
        obj[schema.name] = obj[schema.name].concat(
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

    return process({}, dom.window.document.querySelector(":root"), schema);
}

module.exports = {
    extract,
};
