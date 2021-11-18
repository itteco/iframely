var pluginLoader = require('../../../loader/pluginLoader'),
    plugins = pluginLoader._plugins;

module.exports = {

    prepareLink: function(whitelistRecord, options, link, pluginId) {

        if (link.type === CONFIG.T.flash) {
            link.error = 'Adobe Flash Player is no longer supported';
            return;
        }        

        var plugin = plugins[pluginId];

        if (plugin.domain || plugin.custom || (link.rel && (link.rel.indexOf(CONFIG.R.icon) > -1 || link.rel.indexOf(CONFIG.R.thumbnail) > -1))) {
            return;
        }

        // Proxy QA tags, but ignore the ones from the config wildcard
        if (whitelistRecord && whitelistRecord.getQATags && !whitelistRecord.isDefault && link.rel.indexOf('allow') == -1) {
            var tags = whitelistRecord.getQATags(link.rel);
            link.rel = link.rel.concat(tags);
        }

        link.rel = [...new Set(link.rel)]; // Defined && unique.

        if (options && !options.debug && link.rel.indexOf('deny') > -1) {
            // Skip "deny" links in debug mode.
            link.error = 'Link is denied by whitelist';
            return;
        }        
    }
};