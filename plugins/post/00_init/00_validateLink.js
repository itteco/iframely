module.exports = {

    prepareLink: function(url, link) {

        if (!link.href) {
            // Skip not full data.
            link.error = 'Link "href" required';
            return;
        }

        if (typeof link.href !== "string") {
            link.error = "Non string href";
            return;
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

        // Resolve uri.
        if (!link.href.match(/^(https?:)?\/\//)) {
            // Skip urls starting from http(s) or //.
            link.href = url.resolve(url, link.href);
        }
    }
};