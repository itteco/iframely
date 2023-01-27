export default {

    highestPriority: true,

    // Override meta if publisher targets Iframely or one of the apps
    getMeta: function(meta, options) {

        var appname = options.getProviderOptions('app.name');
        if (appname) {
            appname = appname.toLowerCase();
        }        

        var data;
        if (appname && meta[appname]) {
            data = meta[appname];
        } else if (meta.iframely) {
            data = meta.iframely;
        }

        if (data) {
            // Delete all attributes from <link rel="iframely"> w/o additional "app", "player" etc.
            delete data.href;
            delete data.type;
            delete data.media;
            delete data.sizes;
            delete data.rel;

            return data;
        }
    }
}