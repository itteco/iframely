(function() {

    // Monkey patch before you require http for the first time.
    var majorVersion = process.version.match(/v(\d+)\./);
    majorVersion = parseInt(majorVersion);
    if (majorVersion < 10) {
        process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
    }

    var _ = require('underscore');
    var path = require('path');
    var fs = require('fs');

    var version = require('./package.json').version;

    var config = {

        baseAppUrl: "",
        port: 8061,
        relativeStaticUrl: "/s",
        DEBUG: false,

        WHITELIST_URL: 'https://iframely.com/qa/whitelist.json',
        WHITELIST_URL_RELOAD_PERIOD: 60 * 60 * 1000,  // will reload WL every hour, if no local files are found in /whitelist folder

        WHITELIST_WILDCARD: {},
        WHITELIST_LOG_URL: 'https://iframely.com/whitelist-log',

        // Default cache engine to prevent warning.
        CACHE_ENGINE: 'node-cache',
        CACHE_TTL: 24 * 60 * 60,
        API_REQUEST_CACHE_TTL: 30 * 24 * 60 * 60,
        IMAGE_META_CACHE_TTL: 7 *24 * 60 * 60,

        CACHE_TTL_PAGE_TIMEOUT: 10 * 60,
        CACHE_TTL_PAGE_404: 10 * 60,
        CACHE_TTL_PAGE_OTHER_ERROR: 1 * 60,

        CLUSTER_WORKER_RESTART_ON_PERIOD: 8 * 3600 * 1000, // 8 hours.
        CLUSTER_WORKER_RESTART_ON_MEMORY_USED: 120 * 1024 * 1024, // 120 MB.

        RESPONSE_TIMEOUT: 5 * 1000,

        SHUTDOWN_TIMEOUT: 6 * 1000,

        USER_AGENT: "Iframely/" + version + " (+http://iframely.com/;)",
        VERSION: version,

        FB_USER_AGENT: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',

        ACCEPT_LANGUAGE_SUFFIX: ';q=0.9,en;q=0.7,*;q=0.5',

        SKIP_IFRAMELY_RENDERS: false,
        DEFAULT_ASPECT_RATIO: 16 / 9,
        MAX_VERTICAL_ASPECT_RATIO: 1,
        ASPECT_RATIO_PRECISION: 0.25,

        DEFAULT_OMIT_CSS_WRAPPER_CLASS: 'iframely-responsive',
        DEFAULT_MAXWIDTH_WRAPPER_CLASS: 'iframely-embed',

        T: {
            text_html: "text/html",
            maybe_text_html: "maybe_text_html",            
            javascript: "application/javascript",
            safe_html: "text/x-safe-html",
            image_jpeg: "image/jpeg",
            flash: "application/x-shockwave-flash",
            image: "image",
            image_icon: "image/icon",
            image_png: "image/png",
            image_svg: "image/svg",
            image_gif: "image/gif",
            image_webp: "image/webp",
            video_mp4: "video/mp4",
            video_ogg: "video/ogg",
            video_webm: "video/webm",
            stream_apple_mpegurl: "application/vnd.apple.mpegurl",
            stream_x_mpegurl: "application/x-mpegURL",
            audio_mp3: "audio/mp3"
        },

        PROMO_RELS: [
            "player",
            "image",
            "thumbnail"
        ],

        REL_GROUPS: [
            "promo",
            "app",
            "player",
            "survey",
            "summary",
            "image",
            "reader",
            "thumbnail",
            "logo",
            "icon",
            "file"
        ],

        MEDIA_ATTRS: [
            "width",
            "min-width",
            "max-width",
            "height",
            "min-height",
            "max-height",
            "aspect-ratio",
            "padding-bottom",
            "scrolling"
        ],

        R: {
            player: "player",
            thumbnail: "thumbnail",
            image: "image",
            reader: "reader",
            file: "file",
            survey: "survey",
            app: "app",
            summary: "summary",

            iframely: "iframely",
            og: "og",
            twitter: "twitter",
            oembed: "oembed",
            sm4: "sm4",

            icon: "icon",
            logo: "logo",

            inline: "inline",
            ssl: "ssl",

            autoplay: "autoplay",
            html5: "html5",
            gifv: "gifv",

            promo: "promo",
            playerjs: "playerjs",

            audio: 'audio',
            slideshow: 'slideshow',
            playlist: 'playlist'            
        },

        // Option names
        O: {
            // compact & full - deprecated
            compact: "iframely.less",
            full: "iframely.more",
            // use O.more & O.less instead
            more: "iframely.more",
            less: "iframely.less"
        },

        // Option labels:
        L: {
            horizontal: 'Slimmer horizontal player',
            playlist: 'Include playlist',
            hide_artwork: 'Hide artwork',
            theme: 'Theme color',
            light: 'Light',
            dark: 'Dark',
            auto: 'Auto',
            default: 'Default',
            height: 'Adjust height',
            page: 'Active page'
        },

        // Whitelist settings.
        REL: {
            "iframely": [
                "reader",
                "app",
                "player",
                "survey",
                "image",
                "summary",
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
            "sm4": [
                "video"
            ],
            "oembed": [
                "link",
                "rich",
                "video",
                "photo"
            ],
            "html-meta": [  // TODO: Need change to 'fb'.
                "video",
                "embedURL"
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
            "iframely",
            "sm4"
        ],

        KNOWN_VIDEO_SOURCES: /(youtube|youtu|youtube\-nocookie|vimeo|dailymotion|theplatform|jwplatform|jwplayer|ooyala|cnevids|newsinc|podbean|simplecast|libsyn|wistia|podiant|art19|kaltura|mtvnservices|brightcove|bcove|soundcloud|giphy|viddler|flowplayer|vidible|bandzoogle|podigee|smugmug|facebook|vid)\./i,

        OEMBED_RELS_PRIORITY: ["app", "player", "survey", "image", "reader"],
        OEMBED_RELS_MEDIA_PRIORITY: ["player", "survey", "image", "reader", "app"],

        providerOptions: {
            "readability": {},
            "twitter.status": {}
        }
    };

    var env_config_path = path.resolve(
        __dirname,
        "config." + (process.env.NODE_ENV || "local") + ".js"
    );

    var local_config_path = path.resolve(__dirname, "config.local.js");

    var local;

    // Try config by NODE_ENV.
    if (fs.existsSync(env_config_path)) {

        local = require(env_config_path);

    } else if (fs.existsSync(local_config_path)) {
        // Else - try local config.

        local = require(local_config_path);
    }

    _.extend(config, local);

    config.baseStaticUrl = config.baseAppUrl + config.relativeStaticUrl;

    module.exports = config;
})();
