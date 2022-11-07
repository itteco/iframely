export default {

    highestPriority: true,

    // Override meta if publisher targets Iframely or one of the apps
    getMeta: function(meta, options) {

        var appname = options.getProviderOptions('app.name');
        if (appname) {
            appname = appname.toLowerCase();
        }        

        if (appname && meta[appname]) {
            return meta[appname];
        } else if (meta.iframely) {
            return meta.iframely;
        }
    }
}