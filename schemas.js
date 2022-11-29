module.exports = function (ex) {
    return {
        bbcNews: [
            { select: "head > title", name: "title", transform: ex.helpers.getTextContent },
            {
                select: ".nw-c-top-stories",
                name: "news",
                children: [
                    {
                        selectAll: ".nw-c-promo",
                        name: "headlines",
                        //transform: (el) => el.parentElement.outerHTML.replace(el.parentElement.innerHTML || "", ""),
                        //transform: (el) => Array.from(el.classList),
                        skip: (el) => {
                            return el.parentElement.style.display == "none";
                        },
                        children: [
                            {
                                select: ".gs-c-promo-heading > .gs-c-promo-heading__title",
                                name: "heading",
                                transform: ex.helpers.getTextContentNormalised,
                            },
                            {
                                select: ".gs-c-promo-summary",
                                name: "summary",
                                transform: ex.helpers.getTextContentNormalised,
                            },
                            {
                                select: "ul",
                                name: "metadata",
                                transform: (el) => {
                                    var time = el.querySelector("li.nw-c-promo-meta time").getAttribute("data-seconds");
                                    var location = ex.helpers.getTextContentNormalised(el.querySelector("li.nw-c-promo-meta a"));

                                    return {
                                        time,
                                        location,
                                    };
                                },
                            },
                            {
                                select: "a.gs-c-promo-heading",
                                name: "link",
                                transform: (el) => el.getAttribute("href"),
                            },
                            {
                                select: ".gs-c-promo-image img",
                                name: "image",
                                transform: (el) => {
                                    const srcSet = el.getAttribute("srcset");
                                    if (srcSet) {
                                        return srcSet.split(", ").map((x) => {
                                            var sp = x.split(" ");
                                            return {
                                                size: sp[1].replace("w", ""),
                                                url: sp[0],
                                            };
                                        });
                                    } else {
                                        var sizes = el.getAttribute("data-widths").slice(1, -1).split(",");
                                        var baseUrl = el.getAttribute("data-src");
                                        return sizes.map((x) => {
                                            return {
                                                size: x,
                                                url: baseUrl.replace("{width}", x),
                                            };
                                        });
                                    }
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    };
};
