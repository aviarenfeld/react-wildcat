"use strict";

const realFetch = require("node-fetch");

module.exports = function fetch(url, options) {
    if (/^\/\//.test(url)) {
        url = `https:${url}`;
    }

    return realFetch.call(this, url, options);
};

/* istanbul ignore else */
if (typeof global !== "undefined" && !global.fetch) {
    global.fetch = module.exports;
}
