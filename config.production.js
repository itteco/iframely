import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Optional SSL cert, if you serve under HTTPS.
/*
const ssl_key = const file = await readFile(new URL('./key.pem', import.meta.url), {encoding: 'utf8'});
const ssl_cert = await readFile(new URL('./cert.pem', import.meta.url), {encoding: 'utf8'});
*/

export default {

    // Specify a path for custom plugins. Custom plugins will override core plugins.
    // CUSTOM_PLUGINS_PATH: __dirname + '/yourcustom-plugin-folder',

    DEBUG: false,
    RICH_LOG_ENABLED: false,

    // For embeds that require render, baseAppUrl will be used as the host.
    baseAppUrl: "http://iframely.dothnews.com.br:8061", // use "https://yourdomain.com/path" where you have Iframely in your reverse proxy
    relativeStaticUrl: "/r",

    // Or just skip built-in renders altogether
    SKIP_IFRAMELY_RENDERS: true,

    // For legacy reasons the response format of Iframely open-source is
    // different by default as it does not group the links array by rel.
    // In order to get the same grouped response as in Cloud API,
    // add `&group=true` to your request to change response per request
    // or set `GROUP_LINKS` in your config to `true` for a global change.
    GROUP_LINKS: true,

    // Number of maximum redirects to follow before aborting the page
    // request with `redirect loop` error.
    MAX_REDIRECTS: 4,

    SKIP_OEMBED_RE_LIST: [
        // /^https?:\/\/yourdomain\.com\//,
    ],

    /*
    // Used to pass parameters to the generate functions when creating HTML elements
    // disableSizeWrapper: Don't wrap element (iframe, video, etc) in a positioned div
    GENERATE_LINK_PARAMS: {
        disableSizeWrapper: true
    },
    */

    port: 8061, //can be overridden by PORT env var
    host: '0.0.0.0',    // Dockers beware. See https://github.com/itteco/iframely/issues/132#issuecomment-242991246
                        //can be overridden by HOST env var

    // Optional SSL cert, if you serve under HTTPS.
    /*
    ssl: {
        key: ssl_key,
        cert: ssl_cert,
        port: 443
    },
    */

    /*
    Supported cache engines:
    - no-cache - no caching will be used.
    - node-cache - good for debug, node memory will be used (https://github.com/tcs-de/nodecache).
    - redis - https://github.com/mranney/node_redis.
    - memcached - https://github.com/3rd-Eden/node-memcached
    */
    CACHE_ENGINE: 'node-cache',
    CACHE_TTL: 0, // In seconds. 
    // 0 = 'never expire' for memcached & node-cache to let cache engine decide itself when to evict the record
    // 0 = 'no cache' for redis. Use high enough (e.g. 365*24*60*60*1000) ttl for similar 'never expire' approach instead

    /*
    // Redis mode (cluster or standard)
    REDIS_MODE: 'standard',
    */

    /*
    // Redis cache options.
    REDIS_OPTIONS: {
        socket: {
            host: '127.0.0.1',
            port: 6379
        }
    },
    */

    /*
    // Redis cluster options.
    REDIS_CLUSTER_OPTIONS: {
        servers: [
             {
                 host: '10.0.0.10',
                 port: 6379
             },
             // ...
         ],
    },
    */

    /*
    // Memcached options. See https://github.com/3rd-Eden/node-memcached#server-locations
    MEMCACHED_OPTIONS: {
        locations: "127.0.0.1:11211"
    }
    */

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

    // If there's no response from remote server, the timeout will occur after
    RESPONSE_TIMEOUT: 5 * 1000, //ms

    // Customize API calls to oembed endpoints.
    // Must have: please add your `access_token` for Facebook and Instagram API calls
    ADD_OEMBED_PARAMS: [{
        
        re: [ // Endpoint's URL regexp array.
            /^https:\/\/graph\.facebook\.com\/v[0-9\.]+\/instagram_oembed/i
        ],
        params: { // Custom query-string params object.

            // TODO: get your access Insagtam token as described 
            // on https://developers.facebook.com/docs/instagram/oembed/                
            access_token: '',   // The simplest way is 
                                // to use `{app-id}|{app secret}` as access token

            // Add any other optional params
            hidecaption: true
        }
    }, {
        re: [/^https:\/\/graph\.facebook\.com\/v[0-9\.]+\/oembed_page/i],
        params: {
            // TODO: get your access token as described 
            // on https://developers.facebook.com/docs/plugins/oembed                
            access_token: '',   // The simplest way is 
                                // to use `{app-id}|{app secret}` as access token

            // Add any other optional params
            show_posts: 0,
            show_facepile: 0,
            maxwidth: 600
        }
    }, {
        // match i=user or i=moment or i=timeline to configure these types invidually
        // see params spec at https://dev.twitter.com/web/embedded-timelines/oembed
        re: [/^https?:\/\/publish\.twitter\.com\/oembed\?i=user/i],
        params: {
            limit: 1,
            maxwidth: 600
        }
    }, {
        // Facebook https://developers.facebook.com/docs/plugins/oembed/
        re: [/^https:\/\/graph\.facebook\.com\/v[0-9\.]+\/oembed_/i],
        params: {
            // TODO: get your access token as described 
            // on https://developers.facebook.com/docs/plugins/oembed                
            access_token: '',   // The simplest way is 
                                // to use `{app-id}|{app secret}` as access token

            // Add any other optional params, like skip script tag and fb-root div
            // omitscript: true
        }
     }],

    /* Configure use of HTTP proxies, headers as needed. 
       You don't have to specify all options per regex - just what you need to override
    */
    /*
    PROXY: [{
        re: [/^https?:\/\/www\.domain\.com/],

        // Either `proxy`, or `proxy_url`, or none.
        proxy: true,  // Will fetch URL via echo service configured as PROXY_URL. See below.
        // proxy_url: 'http://1.2.3.4:8080?url={url}', // Will fetch URL via this exact echo service, see below.

        user_agent: 'CHANGE YOUR AGENT',
        headers: {
            // HTTP headers
            // Overrides previous params if overlapped.
        },
        cache_ttl: 3600  // in seconds, cache response for 1 hour.
    }],

    // Proxy now requires an echo service endpoint. 
    // See #354 and example code at 
    // https://gist.github.com/nleush/7916ee89f7b8d6f0cd478d7335702139
    PROXY_URL: 'http://1.2.3.4:8080?url={url}',  // Iframely will add `?url=...` to this endpoint
    */

    // Customize API calls to 3rd parties. At the very least - configure required keys.
    // For available provider options - please see the code of its domain plugin.
    providerOptions: {
        locale: "en_US",    // ISO 639-1 two-letter language code, e.g. en_CA or fr_CH. 
                            // Will be added as highest priotity in accept-language header with each request. 
                            // Plus is used in FB, YouTube and perhaps other plugins
        "twitter": {
            "max-width": 550,
            "min-width": 250,
            hide_media: false,
            hide_thread: false,
            omit_script: false,
            center: false,
            // dnt: true,                
            cache_ttl: 100 * 365 * 24 * 3600 // 100 Years.
        },
        readability: {
            enabled: false
            // allowPTagDescription: true  // to enable description fallback to first paragraph
        },
        images: {
            loadSize: false, // if true, will try an load first bytes of all images to get/confirm the sizes
            checkFavicon: false // if true, will verify all favicons
        },
        tumblr: {
            consumer_key: "INSERT YOUR VALUE"
            // media_only: true     // disables status embeds for images and videos - will return plain media
        },
        google: {
            // https://developers.google.com/maps/documentation/embed/guide#api_key
            maps_key: "INSERT YOUR VALUE"
        }, 

        /*
        // Optional Camo Proxy to wrap all images: https://github.com/atmos/camo
        camoProxy: {
            camo_proxy_key: "INSERT YOUR VALUE",
            camo_proxy_host: "INSERT YOUR VALUE"
            // ssl_only: true // will only proxy non-ssl images
        },
        */

        // List of query parameters to add to YouTube and Vimeo frames
        // Start it with leading "?". Or omit alltogether for default values
        // API key is optional, youtube will work without it too.
        // It is probably the same API key you use for Google Maps.
        youtube: {
            // api_key: "INSERT YOUR VALUE",
            // parts: [ "snippet", "player" ], // list of fields you want to use in the request, in most cases you only need those two
            get_params: "?rel=0&showinfo=1"     // https://developers.google.com/youtube/player_parameters
        },
        vimeo: {
            get_params: "?byline=0&badge=0"     // https://developer.vimeo.com/player/embedding
        },
        soundcloud: {
            old_player: true // enables classic player
        },
        giphy: {
            media_only: true // disables branded player for gifs and returns just the image
        },
        bandcamp: {
            get_params: '/size=large/bgcol=333333/linkcol=ffffff/artwork=small/transparent=true/',
            media: {
                album: {
                    height: 472,
                    'max-width': 700
                },
                track: {
                    height: 120,
                    'max-width': 700
                }
            }
        },
        // Docs: https://dev.twitch.tv/docs/embed/video-and-clips
        /*
        twitch: {
            parent: 'jsbin.com, null.jsbin.com, localhost'
        },
        */
    },

    // WHITELIST_WILDCARD, if present, will be added to whitelist as record for top level domain: "*"
    // with it, you can define what parsers do when they run accross unknown publisher.
    // If absent or empty, all generic media parsers will be disabled except for known domains
    // More about format: https://iframely.com/docs/qa-format

    /*
    WHITELIST_WILDCARD: {
          "twitter": {
            "player": "allow",
            "photo": "deny"
          },
          "oembed": {
            "video": "allow",
            "photo": "allow",
            "rich": "deny",
            "link": "deny"
          },
          "og": {
            "video": ["allow", "ssl", "responsive"]
          },
          "iframely": {
            "survey": "allow",
            "reader": "allow",
            "player": "allow",
            "image": "allow"
          },
          "html-meta": {
            "video": ["allow", "responsive"],
            "promo": "allow"
          }
    }
    */

    // The list of regexs to be ignored. Iframely will return 417
    // At minimum, keep your localhosts ignored to avoid SSRF
    IGNORE_DOMAINS_RE: [
        /^https?:\/\/127\.0\.0\.1/i,
        /^https?:\/\/localhost/i,
        /^https?:\/\/[^\/]+:\d+\/?/, // Blocks port-scan via DNS pointing to 127.0.0.1

        // And this is AWS metadata service
        // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html
        /^https?:\/\/169\.254\.169\.254/
    ],

    // Endpoint for prerender service, if you need it. Used to parse React apps. Very slow.
    // Tested with https://github.com/prerender/prerender
    // PRERENDER_URL: "https://domain/render?url="
};
