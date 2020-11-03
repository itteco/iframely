module.exports = {

    prepareLink: function(url, options, link) {

        if ((link.type === CONFIG.T.text_html || link.accept && link.accept.length === 1 && link.accept.indexOf(CONFIG.T.text_html) > -1)
            && link.rel.indexOf(CONFIG.R.resizable) > -1 
            && link.media 
            && link.media.height
            && (Object.keys(link.media).length === 1
                || (Object.keys(link.media).length === 2 && link.media.scrolling))
        ) {

            var provider = url.match(/^https?:\/\/(?:[^\.]+)?\.([^\/:?#]+)/)[1];
            provider = provider.replace(/\./g, '-');

            link.options = link.options || {};
            var height = options.getRequestOptions(provider + ".height", link.media.height);

            link.options.height = {
                label: CONFIG.L.height,
                value: height,
                placeholder: "ex.: 600, in px"
            };
            link.media.height = height;
        }
    }
};