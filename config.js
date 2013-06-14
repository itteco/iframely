(function() {
    var _ = require('underscore');
    var path = require('path');
    var fs = require('fs');

    var config = {
        DEBUG: false,

        baseAppUrl: "http://yourdomain.com",
        relativeStaticUrl: "/r",

        port: 8061,

        /*
        // Access-Control-Allow-Origin list.
        allowedOrigins: [
            "*",
            "http://another_domain.com"
        ],
        */

        /*
        // Uncomment to enable plugin testing framework.
        tests: {
            mongodb: 'mongodb://localhost:27017/iframely-tests',
            single_test_timeout: 10 * 1000,
            plugin_test_period: 2 * 60 * 60 * 1000,
            relaunch_script_period: 5 * 60 * 1000
        },
        */

        metaLoadingTimeout: 15 * 1000,

        T: {
            text_html: "text/html",
            javascript: "application/javascript",
            safe_html: "text/x-safe-html",
            image_jpeg: "image/jpeg",
            flash: "application/x-shockwave-flash",
            image: "image",
            image_icon: "image/icon",
            image_png: "image/png",
            image_svg: "image/svg",
            video_mp4: "video/mp4"
        },

        REL_GROUPS: [
            "reader",
            "player",
            "image",
            "thumbnail",
            "logo",
            "icon"
        ],

        R: {
            player: "player",
            thumbnail: "thumbnail",
            image: "image",
            reader: "reader",
            file: "file",

            iframely: "iframely",
            instapaper: "instapaper",
            og: "og",
            twitter: "twitter",
            oembed: "oembed",

            icon: "icon",
            logo: "logo"
        },

        providerOptions: {
            "twitter.status": {
                "max-width": 550,
                "min-width": 250,
                consumer_key: 'INSERT YOUR VALUE',
                consumer_secret: 'INSERT YOUR VALUE',
                access_token: 'INSERT YOUR VALUE',
                access_token_secret: 'INSERT YOUR VALUE',
                hide_media: false,
                hide_thread: false,
                omit_script: false
            },
            flickr: {
                apiKey: 'INSERT YOUR VALUE'
            },
            readability: {
                enabled: true
            }
        }
    };

    var local_config_path = path.resolve(__dirname, "config.local.js");
    if (fs.existsSync(local_config_path)) {
        var local = require(local_config_path);
        _.extend(config, local);
    }

    config.baseStaticUrl = config.baseAppUrl + config.relativeStaticUrl;

    module.exports = config;
})();
