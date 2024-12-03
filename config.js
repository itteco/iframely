    import * as path from 'path';
    import * as fs from 'fs';
    import * as yaml_config from 'node-yaml-config';

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    import { readFile } from 'fs/promises';
    const json = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
    var version = json.version;

    const config = {

        baseAppUrl: "",
        port: 8061,
        relativeStaticUrl: "/s",
        use_http2: true,
        DEBUG: false,

        WHITELIST_URL: 'https://iframely.com/qa/domains.json',
        WHITELIST_URL_RELOAD_PERIOD: 60 * 60 * 1000,  // will reload WL every hour, if no local files are found in /whitelist folder

        WHITELIST_WILDCARD: {},

        // Default cache engine to prevent warning.
        CACHE_ENGINE: 'node-cache',
        CACHE_TTL: 24 * 60 * 60,
        CACHE_ERROR_TTL: 10 * 60,   // 10 min - cache for error responses.
        API_REQUEST_CACHE_TTL: 30 * 24 * 60 * 60,
        IMAGE_META_CACHE_TTL: 7 * 24 * 60 * 60,

        CACHE_TTL_PAGE_TIMEOUT: 10 * 60,
        CACHE_TTL_PAGE_404: 10 * 60,
        CACHE_TTL_PAGE_OTHER_ERROR: 1 * 60,

        HTTP2_RETRY_CODES_LIST: [
            'ECONNRESET',
            'ESOCKETTIMEDOUT'
        ],

        CLUSTER_WORKER_RESTART_ON_PERIOD: 8 * 3600 * 1000, // 8 hours.
        CLUSTER_WORKER_RESTART_ON_MEMORY_USED: 120 * 1024 * 1024, // 120 MB.

        MAX_REDIRECTS: 5,

        RESPONSE_TIMEOUT: 15 * 1000,

        SHUTDOWN_TIMEOUT: 6 * 1000,

        VERSION: version,

        FB_USER_AGENT: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',

        ACCEPT_LANGUAGE_SUFFIX: ';q=0.9,en;q=0.7,*;q=0.5',

        SKIP_IFRAMELY_RENDERS: false,
        DEFAULT_ASPECT_RATIO: 16 / 9,
        DOC_ASPECT_RATIO: 8.5 / 11,
        MAX_VERTICAL_ASPECT_RATIO: 1,
        ASPECT_RATIO_PRECISION: 0.25,

        DEFAULT_OMIT_CSS_WRAPPER_CLASS: 'iframely-responsive',
        DEFAULT_MAXWIDTH_WRAPPER_CLASS: 'iframely-embed',
        FORCE_WIDTH_LIMIT_CONTAINER: false,

        T: {
            text_html: "text/html",
            maybe_text_html: "maybe_text_html",            
            javascript: "application/javascript",
            safe_html: "text/x-safe-html",
            image_jpeg: "image/jpeg",
            flash: "application/x-shockwave-flash", // Adobe Flash Player is no longer supported
            image: "image",
            image_icon: "image/icon",
            image_png: "image/png",
            image_svg: "image/svg+xml",
            image_gif: "image/gif",
            image_webp: "image/webp",
            video_mp4: "video/mp4",
            video_ogg: "video/ogg",
            video_webm: "video/webm",
            stream_apple_mpegurl: "application/vnd.apple.mpegurl",
            stream_x_mpegurl: "application/x-mpegURL",
            audio_mp3: "audio/mp3",
            audio_mpeg: "audio/mpeg",
            audio_mp4: "audio/mp4"
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

            icon: "icon",
            logo: "logo",

            inline: "inline",
            ssl: "ssl",
            resizable: "resizable",

            autoplay: "autoplay",
            html5: "html5",
            gifv: "gifv",

            promo: "promo",
            playerjs: "playerjs",

            audio: 'audio',
            slideshow: 'slideshow',
            playlist: 'playlist',
            '3d': '3d',
            encrypted: 'encrypted-media',

            profile: 'profile',
            map: 'map',

            maxwidth: 'maxwidth'
        },

        FEATURES: [ // feature policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#Directives
            'accelerometer', 'ambient-light-sensor', 'autoplay', 'battery', 'bluetooth', 'camera', 'clipboard-read', 
            'clipboard-write', 'display-capture', 'document-domain', 'encrypted-media', 'execution-while-not-rendered', 
            'execution-while-out-of-viewport', 'fullscreen', 'gamepad', 'geolocation', 'gyroscope', 'hid', 
            'identity-credentials-get', 'idle-detection', 'local-fonts', 'magnetometer', 'microphone', 'midi', 
            'otp-credentials', 'payment', 'picture-in-picture', 'publickey-credentials-get', 'screen-wake-lock', 
            'serial', 'speaker-selection', 'storage-access', 'usb', 'web-share', 'window-management', 'xr-spatial-tracking'
        ],

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
            width: 'Adjust width',
            page: 'Active page'
        },

        LC: {
            "af": "Afrikaans",
            "sq": "Albanian",
            "arq": "Algerian Arabic",
            "am": "Amharic",
            "ar": "Arabic",
            "hy": "Armenian",
            "ast": "Asturian",
            "az": "Azerbaijani",
            "eu": "Basque",
            "be": "Belarusian",
            "bn": "Bengali",
            "bi": "Bislama",
            "bs": "Bosnian",
            "bg": "Bulgarian",
            "my": "Burmese",
            "ca": "Catalan",
            "ceb": "Cebuano",
            "zh-cn": "Chinese, Simplified",
            "zh-tw": "Chinese, Traditional",
            "zh": "Chinese, Yue",
            "ht": "Creole, Haitian",
            "hr": "Croatian",
            "cs": "Czech",
            "da": "Danish",
            "nl": "Dutch",
            "dz": "Dzongkha",
            "en": "English",
            "eo": "Esperanto",
            "et": "Estonian",
            "fil": "Filipino",
            "fi": "Finnish",
            "fr": "French",
            "fr-ca": "French (Canada)",
            "gl": "Galician",
            "ka": "Georgian",
            "de": "German",
            "el": "Greek",
            "gu": "Gujarati",
            "cnh": "Hakha Chin",
            "ha": "Hausa",
            "he": "Hebrew",
            "hi": "Hindi",
            "hu": "Hungarian",
            "hup": "Hupa",
            "is": "Icelandic",
            "ig": "Igbo",
            "id": "Indonesian",
            "inh": "Ingush",
            "ga": "Irish",
            "it": "Italian",
            "ja": "Japanese",
            "kn": "Kannada",
            "kk": "Kazakh",
            "km": "Khmer",
            "tlh": "Klingon",
            "ko": "Korean",
            "ku": "Kurdish",
            "lo": "Lao",
            "ltg": "Latgalian",
            "la": "Latin",
            "lv": "Latvian",
            "lt": "Lithuanian",
            "lb": "Luxembourgish",
            "rup": "Macedo",
            "mk": "Macedonian",
            "mg": "Malagasy",
            "ms": "Malay",
            "ml": "Malayalam",
            "mr": "Marathi",
            "mfe": "Mauritian Creole",
            "mn": "Mongolian",
            "srp": "Montenegrin",
            "ne": "Nepali",
            "nb": "Norwegian Bokmal",
            "nn": "Norwegian Nynorsk",
            "oc": "Occitan",
            "ps": "Pashto",
            "fa": "Persian",
            "pl": "Polish",
            "pt": "Portuguese",
            "pt-br": "Portuguese, Brazilian",
            "pa": "Punjabi",
            "ro": "Romanian",
            "ru": "Russian",
            "ry": "Rusyn",
            "sc": "Sardinian",
            "sr": "Serbian",
            "sh": "Serbo-Croatian",
            "szl": "Silesian",
            "si": "Sinhala",
            "sk": "Slovak",
            "sl": "Slovenian",
            "so": "Somali",
            "sp": "Spanish",
            "es": "Spanish",
            "sw": "Swahili",
            "sv": "Swedish",
            "art-x-bork": "Swedish Chef",
            "tl": "Tagalog",
            "tg": "Tajik",
            "ta": "Tamil",
            "tt": "Tatar",
            "te": "Telugu",
            "th": "Thai",
            "bo": "Tibetan",
            "aeb": "Tunisian Arabic",
            "tr": "Turkish",
            "tk": "Turkmen",
            "uk": "Ukrainian",
            "ur": "Urdu",
            "ug": "Uyghur",
            "uz": "Uzbek",
            "vi": "Vietnamese",
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
            "oembed": [
                "link",
                "rich",
                "video",
                "photo"
            ],
            "html-meta": [
                "video",
                "embedURL"
            ]
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

        KNOWN_VIDEO_SOURCES: /(youtube|youtu|youtube\-nocookie|vimeo|dailymotion|theplatform|jwplatform|jwplayer|cnevids|newsinc|podbean|simplecast|libsyn|wistia|podiant|art19|kaltura|mtvnservices|brightcove|bcove|soundcloud|giphy|viddler|flowplayer|vidible|bandzoogle|podigee|smugmug|facebook|vid|ultimedia|mixcloud|vidyard|youplay|streamable|captivate|mdstrm|mediadelivery|hearstapps|rudo|acast|screen9|spotlightr)\.\w+\//i,

        OEMBED_RELS_PRIORITY: ["app", "player", "survey", "image", "reader"],
        OEMBED_RELS_MEDIA_PRIORITY: ["player", "survey", "image", "reader", "app"],

        providerOptions: {
            "readability": {},
            "twitter.status": {}
        },

        LOG_DATE_FORMAT: "\\[YY-MM-DD HH:mm:ss\\]:",

        ERRORS_TO_RETRY: [
            'ECONN',
            'EAI_AGAIN',
            'ENET',
            'HPE_INVALID_',
            'ERR_SSL_'
        ]
    };

    // Providers config loader.
    var local_config_path = path.resolve(__dirname, "config.providers.js");
    if (fs.existsSync(local_config_path)) {
        var local = await import(local_config_path);
        local = local && local.default;
        Object.assign(config, local);
    }


    var env_config_path = path.resolve(
        __dirname,
        "config." + (process.env.NODE_ENV || "local") + ".js"
    );

    local_config_path = path.resolve(__dirname, "config.local.js");

    var local;

    // Try config by NODE_ENV.
    if (fs.existsSync(env_config_path)) {
        local = await import(env_config_path);
        local = local && local.default;

    } else if (fs.existsSync(local_config_path)) {
        // Else - try local config.
        local = await import(local_config_path);
        local = local && local.default;
    }

    Object.assign(config, local);

    env_config_path = path.resolve(
        __dirname,
        "config." + (process.env.NODE_ENV || "local") + ".yml"
    );

    local_config_path = path.resolve(__dirname, "config.local.yml");

    // Try config by NODE_ENV.
    if (fs.existsSync(env_config_path)) {
        local = yaml_config.load(env_config_path);
    } else if (fs.existsSync(local_config_path)) {
        // Else - try local config.
        local = yaml_config.load(local_config_path);
    } else {
        local = null;
    }

    Object.assign(config, local);

    if (!config.baseStaticUrl) {
        config.baseStaticUrl = config.baseAppUrl + config.relativeStaticUrl;
    }

    if (!config.USER_AGENT) {
        var baseAppUrlForAgent;
        if (config.baseAppUrl && config.baseAppUrl.match(/^\/\//)) {
            baseAppUrlForAgent = 'https:' + config.baseAppUrl;
        } else {
            baseAppUrlForAgent = config.baseAppUrl;
        }
        
        config.USER_AGENT = "Iframely/" + version + " (+" + (baseAppUrlForAgent || 'https://github.com/itteco/iframely') + ")";
    }

    config.TYPES = Object.values(config.T);

    config.HTTP2_RETRY_CODES = {};
    config.HTTP2_RETRY_CODES_LIST.forEach(function(item) {
        config.HTTP2_RETRY_CODES[item] = 1;
    });

    export default config;