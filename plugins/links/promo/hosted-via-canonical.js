module.exports = {

    getLink: function(url, meta, options, cb) {

        var canonical = (meta.canonical && meta.canonical.href) || meta.canonical || (meta.og && meta.og.url);

        // Redirect to canonical for known domains
        if (canonical && url !== canonical && (
                canonical.match &&
                canonical.match(/^https?:\/\/news\.iheart\.com\/media\/play\/\d+/i)                
            )) {

            // Do not redirect to url from redirects history.
            if (!options.redirectsHistory || options.redirectsHistory.indexOf(canonical) === -1) {

                return cb({
                    redirect: canonical
                });
            }
        }

        cb(null);
    }

    // ex. http://www.espn1530.com/media/play/27017084/
};