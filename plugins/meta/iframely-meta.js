export default {

    highestPriority: true,

    // Override meta if publisher targets Iframely or one of the apps
    getMeta: function(meta, options) {

        var appname = options.getRequestOptions('app.name', 'iframely');

        if (meta[appname]) {
            return meta[appname];
        }

        // Else if app name is set, but no meta targets that app on the page
        if (meta.iframely) {
            return meta.iframely;
        }
    }
}