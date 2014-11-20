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

    if (m1["aspect-ratio"]) {
        return m1;
    }

    if (m2["aspect-ratio"]) {
        return m2;
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

            var media = findBestMedia(link.media, storedLink.media);
            if (media) {
                // Keep stored link. Update with better media.
                storedLink.media = media;
            }

            // Merge unique rels.
            storedLink.rel = _.union(link.rel || [], storedLink.rel || []);

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