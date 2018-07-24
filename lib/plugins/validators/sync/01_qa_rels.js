var _ = require('underscore');
var pluginLoader = require('../../../loader/pluginLoader'),
    plugins = pluginLoader._plugins;

module.exports = {

    prepareLink: function(whitelistRecord, options, link, pluginId) {

        var plugin = plugins[pluginId];

        if (plugin.domain || plugin.custom || (link.rel && (link.rel.indexOf(CONFIG.R.icon) > -1 || link.rel.indexOf(CONFIG.R.thumbnail) > -1))) {
            return;
        }

        // TODO: remove later, old version feature.
        var rawMeta = {};

        // Proxy QA tags, but ignore the ones from the config wildcard
        if (whitelistRecord && whitelistRecord.getQATags && !whitelistRecord.isDefault && link.rel.indexOf('allow') == -1) {
            var tags = whitelistRecord.getQATags(rawMeta, link.rel);

            // Remove ssl tag.
            // New: do not remove, for "ssl" plugin.
//            var sslIdx = tags.indexOf("ssl");
//            if (sslIdx > -1) {
//                tags.splice(sslIdx, 1);
//            }

            link.rel = link.rel.concat(tags);

            // Exclude html5 rel from flash link. May come from whitelist if page has multiple players.
            var idx;
            if (link.type === CONFIG.T.flash && ((idx = link.rel.indexOf('html5')) > -1)) {
                link.rel.splice(idx, 1);
            }
        }

        // Remove thumbnail if image.
        // Disabled: show both rels.
//        var thumbnailIdx = link.rel.indexOf(CONFIG.R.thumbnail);
//        var imageIdx = link.rel.indexOf(CONFIG.R.image);
//        if (thumbnailIdx > -1 && imageIdx > -1) {
//            link.rel.splice(thumbnailIdx, 1);
//        }

        link.rel = _.compact(_.uniq(link.rel));

        if (options && !options.debug && link.rel.indexOf('deny') > -1) {
            // Skip "deny" links in debug mode.
            link.error = 'Link is denied by whitelist';
            return;
        }
    }
};