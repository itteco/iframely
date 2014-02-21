var _ = require('underscore');

module.exports = {

    prepareLink: function(whitelistRecord, options, link) {

        // TODO: remove later, old version feature.
        var rawMeta = {};

        // Proxy QA tags, but ignore the ones from the config wildcard
        if (whitelistRecord && whitelistRecord.getQATags && !whitelistRecord.isDefault) {
            var tags = whitelistRecord.getQATags(rawMeta, link.rel);
            link.rel = link.rel.concat(tags);
        }

        // Remove thumbnail if image.
        var thumbnailIdx = link.rel.indexOf(CONFIG.R.thumbnail);
        var imageIdx = link.rel.indexOf(CONFIG.R.image);
        if (thumbnailIdx > -1 && imageIdx > -1) {
            link.rel.splice(thumbnailIdx, 1);
        }

        link.rel = _.compact(_.uniq(link.rel));

        if (options && !options.debug && link.rel.indexOf('deny') > -1) {
            // Skip "deny" links in debug mode.
            link.error = 'Link is denied by whitelist';
            return;
        }
    }
};