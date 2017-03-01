module.exports = {

    getLink: function(url, meta, options, cb) {

        var canonical = (meta.canonical && meta.canonical.href) || meta.canonical || (meta.og && meta.og.url);

        if (canonical instanceof Array) {
            canonical = canonical[0];
        }

        // Redirect to canonical from mobile url.
        if (canonical && url !== canonical 
            && (url.match(/^https?:\/\/(m|mobile)\./i) || url.match(/(\.|\/)amp(\.|\/)/i))) {

            // Do not redirect to url from redirects history.
            if (!options.redirectsHistory || options.redirectsHistory.indexOf(canonical) === -1) {

                return cb({
                    redirect: canonical
                });
            }
        }

        cb(null);
    }

    // ex. http://mobile.abc.net.au/news/2014-10-22/government-wants-rooftop-solar-program-to-continue/5833664
    //     http://m.forms2office.com/form/43144244572148
};