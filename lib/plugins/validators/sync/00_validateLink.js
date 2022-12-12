import * as urlLib from 'url';

export default {

    prepareLink: function(url, link) {

        if (link.html || link.template_context || link.template) {

        } else {

            if (!link.href) {
                // Skip incomplete data.
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

            // Resolve uri, also fixes url escaping.
            // ATTN: `urlLib.resolve('http://domain1.com', '//domain2.com')` returns 'http://domain2.com/'
            const isProtocolless = /^\/\//.test(link.href);

            link.href = urlLib.resolve(url, link.href);

            const domainRE = /^(?:https?:)?\/\/([^\/]+)\//;
            var urlDomainMatch, linkDomainMatch;
            // But undo protocol resolution when it forces HTTP or domains do not match.
            if (isProtocolless && (
                /^http:\/\//.test(url)
                || ((urlDomainMatch = url.match(domainRE)) && (linkDomainMatch = link.href.match(domainRE)))
                    && urlDomainMatch[1] !== linkDomainMatch[1]
                )) {
                link.href = link.href.replace(/^https?:\/\//, '//');
            }
        }

        if (!link.rel) {
            // Skip incomplete data.
            link.error = 'Link "rel" required';
            return;
        } else if (link.rel.indexOf(CONFIG.R.app) > -1 && link.rel.indexOf(CONFIG.R.player) > -1) {
            link.rel.splice(link.rel.indexOf(CONFIG.R.app), 1);
        }

        if (!link.type && !link.accept) {
            // Default link type.
            if (link.html) {
                // `text_html` for html app.
                link.type = CONFIG.T.text_html;
            } else if (link.href) {
                // Or check `text_html` for iframes.
                link.accept = [CONFIG.T.text_html];
            } else {
                // Skip incomplete data.
                link.error = 'Link "type" or "accept" required';
            }
        }

        if (link.accept && !Array.isArray(link.accept)) {
            link.accept = [link.accept];
        }

        if (link.type === CONFIG.T.maybe_text_html) {
            console.log('[Deprecation] maybe_text_html type is deprecated. Use "accept" if you expect specific types: ', url);
            delete link.type;
            link.accept = [CONFIG.T.text_html, CONFIG.T.video_mp4];
        }

        // Ensure `rel`` is an Array.
        link.rel = link.rel || [];
        if (!Array.isArray(link.rel)) {
            link.rel = [link.rel];
        }

        // Defined && unique values.
        link.rel = [...new Set(link.rel)];
    }
};