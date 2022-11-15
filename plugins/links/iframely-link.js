import utils from './utils.js';

export default {

    getLinks: function(meta, whitelistRecord, options) {
        let appname = options.getProviderOptions('app.name');
        if (appname) {
            appname = appname.toLowerCase();
        }
        
        let ignoreIframely = false;
        let links = [];

        if (appname && Object.keys(meta).some(key => key.indexOf(appname) === 0)) {
            ignoreIframely = true;
        }

        for (const [key, value] of Object.entries(meta)) {
            if (key.indexOf(appname) === 0 || !ignoreIframely && key.indexOf('iframely') === 0) {
                links = links.concat(utils.parseMetaLinks(key, value, whitelistRecord, appname));
            }
        }

        return links;
    }
};