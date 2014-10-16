var urlLib = require('url');

module.exports = {

    prepareLink: function(url, link) {

        if (link.html || link.template_context || link.template) {

        } else {

            if (!link.href) {
                // Skip not full data.
                link.error = 'Link "href" required';
                return;
            }

            if (typeof link.href !== "string") {
                link.error = "Non string href";
                return;
            }

            // Resolve uri like 'www.domain.com/path'.
            if (link.href.match(/^(\w+\.)?[\w-]+\.\w+/)) {
                link.href = 'http://' + link.href;
            }

            // Resolve uri.
            if (!link.href.match(/^(https?:)?\/\//)) {
                // Skip urls starting from http(s) or //.
                link.href = urlLib.resolve(url, link.href);
            }
        }

        if (!link.rel) {
            // Skip not full data.
            link.error = 'Link "rel" required';
            return;
        }

        if (!link.type) {
            // Skip not full data.
            link.error = 'Link "type" required';
            return;
        }

        // Ensure rel array.
        link.rel = link.rel || [];
        if (!(link.rel instanceof Array)) {
            link.rel = [link.rel];
        }

    }
};