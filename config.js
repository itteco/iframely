(function() {
    var _ = require('underscore');
    var path = require('path');
    var fs = require('fs');

    var config = {
        DEBUG: false,

        baseAppUrl: "http://dev.iframe.ly",
        baseStaticUrl: "http://dev.iframe.ly/r3",
        port: 8061,

        tests: {
            mongodb: 'mongodb://localhost:27017/iframely-tests',
            single_test_timeout: 10000,
            plugin_test_period: 2 * 60 * 60 * 1000
        },

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
                consumer_key: 'OqGh4EYEuQ2OcpyMU6nS6Q',
                consumer_secret: 'lRd8cUQsNqRCVrTiYX4euYSMpgsG1jDcsho8WqFM9so',
                access_token: '988902877-yALuPBW3AdImNUBWfG43AGGZalMj35Al1o16ZjeF',
                access_token_secret: 'r4yFEl32BGFcA7sm7gWa6kpR0rkkPmSe4cnJuD7FSe4',
                hide_media: false,
                hide_thread: false,
                omit_script: false
            },
            flickr: {
                apiKey: 'a4a2c14fc31006239edf38992f101c06'
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

    module.exports = config;
})();
