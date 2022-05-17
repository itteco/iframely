import * as utils from '../../../utils.js';
import * as URL from 'url';

export default {

    prepareLink: function(url, options, link) {

        if ((link.type === CONFIG.T.text_html || link.accept && link.accept.length === 1 && link.accept.indexOf(CONFIG.T.text_html) > -1)
            && link.rel.indexOf(CONFIG.R.resizable) > -1 
            && link.media 
            && link.media.height
            && (Object.keys(link.media).length === 1
                || (Object.keys(link.media).length === 2 && link.media.scrolling))
        ) {

            link.options = link.options || {};

            var query_height;
            if (options.getProviderOptions('allow.undescore', true)) {
                var original = options.redirectsHistory ? options.redirectsHistory[0] : url;
                var query = URL.parse(original, true).query;
                if (query['_height']) {
                    query_height = parseInt(query['_height']);
                } else {
                    if (!link.message) {
                        link.message = `You may also change height by appending ${original.indexOf('?') > -1 ? '&' : '?'}_height= to the URL itself.`
                    }
                }
            }

            var height = options.getRequestOptions(utils.getProviderName(url) + ".height", query_height || link.media.height);

            link.options.height = {
                label: CONFIG.L.height,
                value: height,
                placeholder: "ex.: 600, in px"
            };
            link.media.height = height;

            link.rel = link.rel.filter(r => r !== CONFIG.R.resizable);
        }
    }
};