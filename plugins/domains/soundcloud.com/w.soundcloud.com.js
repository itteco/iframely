const URL = require('url');

module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?/i
    ],

    getData: function(url, meta, options, cb) {

        var canonical = meta.canonical;
        var noRedirectYet = !options.redirectsHistory || options.redirectsHistory.indexOf(canonical) === -1;

        cb (noRedirectYet ? {redirect: canonical} : null);
    }
};