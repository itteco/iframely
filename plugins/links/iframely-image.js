import { getImageLinks } from './og-image.js';

export default {

    getLinks: function(meta, options) {

        var appname = options.getProviderOptions('app.name');
        if (appname) {
            appname = appname.toLowerCase();
        }

        if (appname && meta[appname] && meta[appname].image && !(meta[appname].image instanceof Array)) {
        	return getImageLinks(meta[appname].image, appname);

        } else if (meta.iframely && meta.iframely.image && !(meta.iframely.image instanceof Array)) {
        	return getImageLinks(meta.iframely.image, 'iframely');
        }
    }
};