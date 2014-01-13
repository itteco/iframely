(function() {
    var _ = require('underscore');
    var path = require('path');
    var fs = require('fs');

    var version = require('./package.json').version;

    var config = {

        // Default cache engine to prevent warning.
        CACHE_ENGINE: 'node-cache',
        CACHE_TTL: 24 * 60 * 60,

        CACHE_TTL_PAGE_TIMEOUT: 10 * 60,

        metaLoadingTimeout: 5 * 1000,
        USER_AGENT: "Iframely/" + version + " (+http://iframely.com/;)",

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
            video_mp4: "video/mp4",
            video_ogg: "video/ogg"
        },

        REL_GROUPS: [
            "reader",
            "player",
            "survey",
            "image",
            "thumbnail",
            "logo",
            "icon"
        ],

        MEDIA_ATTRS: [
            "width",
            "min-width",
            "max-width",
            "height",
            "min-height",
            "max-height",
            "aspect-ratio"
        ],

        R: {
            player: "player",
            thumbnail: "thumbnail",
            image: "image",
            reader: "reader",
            file: "file",
            survey: "survey",

            iframely: "iframely",
            instapaper: "instapaper",
            og: "og",
            twitter: "twitter",
            oembed: "oembed",

            icon: "icon",
            logo: "logo",

            inline: "inline",

            autoplay: "autoplay"
        },

        // Whitelist settings.

        REL: {
            "iframely": [
                "reader",
                "player",
                "survey",
                "image",
                "thumbnail",
                "logo"
            ],
            "twitter": [
                "player",
                "photo"
            ],
            "og": [
                "video"
            ],
            "oembed": [
                "link",
                "rich",
                "video",
                "photo"
            ],
            "html-meta": [
                "video"
            ]
        },

        REL_OPTIONS: {
            all: ["ssl"],
            player: ["responsive", "autoplay"],
            video: ["responsive", "autoplay"],
            link: ["reader"],
            rich: ["reader"]
        },

        // whitelist rel to iframely rel.
        REL_MAP: {
            "article": "reader",
            "photo": "image",
            "video": "player"
        },

        // To detect: "html-meta".
        KNOWN_SOURCES: [
            "oembed",
            "og",
            "twitter",
            "iframely"
        ],

        OEMBED_RELS_PRIORITY: ["player", "survey", "image", "reader"]
    };

    var local_config_path = path.resolve(__dirname, "config.local.js");
    if (fs.existsSync(local_config_path)) {
        var local = require(local_config_path);
        _.extend(config, local);
    }

    config.baseStaticUrl = config.baseAppUrl + config.relativeStaticUrl;

    module.exports = config;
})();
