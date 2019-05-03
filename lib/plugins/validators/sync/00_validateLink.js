var urlLib = require('url');
var _ = require('underscore');

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
            if (link.href.match(/^(\w+\.)?[\w-]+\.\w+\//)) {
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

        if (!link.type && !link.accept) {
            // Skip not full data.
            link.error = 'Link "type" or "accept" required';
            return;
        }

        if (link.type === CONFIG.T.maybe_text_html) {
            console.log('[Deprecation] maybe_text_html type is deprecated. Use "accept" if you expect specific types: ');
            console.log('on: ' + url);
            delete link.type;
            link.accept = [CONFIG.T.text_html, CONFIG.T.flash, CONFIG.T.video_mp4];
        }

        if (link.accept && typeof link.accept === 'string') {
            link.accept = [link.accept];
        }

        // Ensure rel array.
        link.rel = link.rel || [];
        if (!(link.rel instanceof Array)) {
            link.rel = [link.rel];
        }

        link.rel = _.compact(_.uniq(link.rel));
    }
};