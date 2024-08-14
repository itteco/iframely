/**
 * This is an alternative fix for https://github.com/itteco/iframely/issues/543.
 * If your servers are in EU, this avoids a redirect to cookie consents, 
 * Activate it by addong 
 */

export default {

    re: /^https?:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i,

    mixins: [
        "domain-icon",
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "oembed-thumbnail",
        "oembed-video", // "allow" attributes will be merged from there
        "oembed-iframe"
    ],

    getLink: function(iframe) {
        return {
            href: iframe.src,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 9/16,
        }
    }
};