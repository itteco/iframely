module.exports = {

    prepareLink: function(link) {
        // Convert options && messages into codes when configured
        if (link.options && CONFIG.i18n) {
            var key; // thanks jslint
            for (key in link.options) {
                if (link.options[key] && CONFIG.i18n[link.options[key]]) {
                    link.options[key] = CONFIG.i18n[link.options[key]];
                }
            }
        }
    }
};