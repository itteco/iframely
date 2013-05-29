(function() {
    var _ = require('underscore');
    var path = require('path');
    var fs = require('fs');

    var config = {
        DEBUG: false,

        baseAppUrl: "http://dev.iframe.ly",
        baseStaticUrl: "http://dev.iframe.ly",
        port: 8061,

        T: {
            text_html: "text/html",
            javascript: "application/javascript",
            safe_html: "text/x-safe-html",
            image_jpeg: "image/jpeg",
            flash: "application/x-shockwave-flash",
            image: "image",
            image_icon: "image/icon",
            image_png: "image/png",
            image_svg: "image/svg"
        },

        REL_GROUPS: [
            "icon",
            "logo",
            "thumbnail",
            "image",
            "player",
            "reader"
        ],

        R: {
            player: "player",
            thumbnail: "thumbnail",
            image: "image",
            reader: "reader",

            iframely: "iframely",
            instapaper: "instapaper",
            og: "og",
            twitter: "twitter",
            oembed: "oembed",
            fb: "fb",

            icon: "icon",
            logo: "logo"
        },

        providerOptions: {
            flickr: {
                apiKey: 'a4a2c14fc31006239edf38992f101c06'
            },
            readability: {
                enabled: false
            }
        }
    };

    var local_config_path = path.resolve(__dirname, "config.local.js");
    if (fs.existsSync(local_config_path)) {
        var local = require(local_config_path);
        _.extend(config, local);
    }

    module.exports = config;
})();
