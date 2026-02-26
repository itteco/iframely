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

        for (const [key, v] of Object.entries(meta)) {
            if (key.indexOf(appname) === 0 || (!ignoreIframely && key.indexOf(CONFIG.R.iframely) === 0)) {

                const value = typeof(v) === 'string' ? {href: v} : v; // If link has no `media` and no `type` attributes, HTMLMetaHandler assigns the value=href;

                let wlr = whitelistRecord;
                if (whitelistRecord.isDefault
                    && !Array.isArray(value) && value.href && /^(?:https?:)?\/\//.test(value.href)
                    && (!value.type || value.type === CONFIG.T.text_html)) {
                    wlr = options.getWhitelistRecord(value.href, {exclusiveRel: 'html-meta'});
                }

                links = links.concat(
                    utils.parseMetaLinks(
                        key, 
                        value,
                        wlr, 
                        ignoreIframely && appname
                    )
                );
            }
        }

        return links;
    }
};