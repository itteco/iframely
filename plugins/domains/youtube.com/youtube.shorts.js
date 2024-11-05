/**
 * This was an alternative fix for https://github.com/itteco/iframely/issues/543.
 * YT Shorts are now covered by main plugin to detect age-restricted players that do not work.
 * Here, we only need a bigger og-image
 */

export default {

    re: /^https?:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i,

    mixins: [
        "og-image",
        "oembed-thumbnail" // smaller image is backup for EU where they may get a redirect to consent page
    ],

    getData: function(options) {
        options.followHTTPRedirect = true;
    }
};