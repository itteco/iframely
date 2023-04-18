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
            if (key.indexOf(appname) === 0 || !ignoreIframely && key.indexOf(CONFIG.R.iframely) === 0) {
                links = links.concat(
                    utils.parseMetaLinks(
                        key, 
                        typeof(value) === 'string' ? {href: value} : value, // If link has no `media` and no `type` attributes, HTMLMetaHandler assigns the value=href;
                        whitelistRecord, 
                        ignoreIframely && appname
                    )
                );
            }
        }

        return links;
    }
};