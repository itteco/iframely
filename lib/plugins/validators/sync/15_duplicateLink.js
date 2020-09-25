var _ = require('underscore');

function findBestMedia(m1, m2) {

    if (!m1 && !m2) {
        return m1;
    }

    if (m1 && !m2) {
        return m1;
    }

    if (!m1 && m2) {
        return m2;
    }

    if (m1["aspect-ratio"] && m1["padding-bottom"]) {
        return m1;
    }

    if (m2["aspect-ratio"] && m2["padding-bottom"]) {
        return m2;
    }

    if (m1["aspect-ratio"]) {
        return m1;
    }

    if (m2["aspect-ratio"]) {
        return m2;
    }

    // Select one with width 100% (width not specified).
    if (m1.width && m1.height && m2.height && !m2.width) {
        return m2;
    }
    if (m2.width && m2.height && m1.height && !m1.width) {
        return m1;
    }

    if (!m2.width || !m2.height) {
        return m1;
    }

    if (!m1.width || !m1.height) {
        return m2;
    }

    return (m1.width > m2.width || m1.height > m2.height) ? m1 : m2;
}

module.exports = {

    prepareLink: function(link, pluginContext) {

        if (!link.href) {
            return;
        }

        var linksHrefDict = pluginContext.linksHrefDict = pluginContext.linksHrefDict || {};

        var linkNoProtocol = link.href.replace(/^https?:/i, "");

        var storedLink = linksHrefDict[linkNoProtocol];

        if (storedLink) {

            if (!storedLink.options && !link.options) {
                var media = findBestMedia(link.media, storedLink.media);
                if (media) {
                    // Keep stored link. Update with better media.
                    storedLink.media = media;
                }
            } // else handle options case separately below

            // Merge unique rels.
            storedLink.rel = _.union(link.rel || [], storedLink.rel || []);

            // Store content_length.
            if (storedLink.content_length || link.content_length) {
                storedLink.content_length = storedLink.content_length || link.content_length;
            }

            // Store options and match it with media
            // If already stored in link - do not replaced
            if (!storedLink.options && link.options) {
                storedLink.options = link.options;
                storedLink.media = link.media;
            }

            // If validation of storedLink isn't completed yet and Link needs to be validted as well.
            if (link.accept && storedLink.accept) {
                storedLink.accept = _.union(link.accept, storedLink.accept || []);

            // If validation already rejected storedLink because of the type.
            } else if (storedLink.type && storedLink.error && storedLink.error.indexOf('not an expected type') > -1) {

                // Type detected for storedLink is actually allowed in Link accept.
                if (link.accept && link.accept instanceof Array 
                    && (link.accept.indexOf(storedLink.type) > -1 || link.accept.indexOf(storedLink.type.replace(/\/.+$/i, '/*')) > -1) ) {
                    delete link.error;

                // Type detected for storedLink is actually allowed via explicit link.type.
                } else if (link.type == storedLink.type) {
                    delete storedLink.error;
                }

            // If validation of storedLink isn't completed yet but Link doesn't need to be validated at all.
            } else if (link.type && storedLink.accept) { 
                delete storedLink.accept;
                storedLink.type = link.type;
            }

            // Set error to new link to remove it from result.
            if (link.href !== storedLink.href && storedLink.href !== linkNoProtocol) {

                // Different protocols.
                storedLink.href = linkNoProtocol;
                link.error = 'Removed href duplication';

            } else {

                link.error = 'Removed href http/https duplication';
            }

        } else {

            // Store new link.
            linksHrefDict[linkNoProtocol] = link;
        }
    }
};