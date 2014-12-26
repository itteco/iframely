module.exports = {

    getLink: function(url, meta, cb) {

        var canonical = meta.canonical && meta.canonical.href || meta.canonical;

        if (!canonical || url == canonical || !url.match(/^https?:\/\/(m|mobile)\./i)) cb(null);
        
        cb ({
            redirect: canonical
        });
    }

    // ex. http://mobile.abc.net.au/news/2014-10-22/government-wants-rooftop-solar-program-to-continue/5833664
    //     http://m.forms2office.com/form/43144244572148
};