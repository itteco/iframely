module.exports = {

    prepareLink: function(link) {

        if (link.options && (link.options['iframely.less'] || link.options['iframely.more'])) {
            delete link.options;
        }

        // Convert options && messages into codes when configured
        if (link.options) {

            if (Object.keys(link.options).length === 0) {
                delete link.options;
            } else {
                var key; // thanks jslint
                for (key in link.options) {
                    if (CONFIG.i18n && link.options[key] && link.options[key].label && CONFIG.i18n[link.options[key].label]) {
                        link.options[key].label = CONFIG.i18n[link.options[key].label];
                    }
                    if (!/^_/.test(key)) {
                        link.options['_' + key] = link.options[key];
                        delete link.options[key];
                    }
                }
            }
        }

    }
};