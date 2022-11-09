const PROFILE_RE = /^https?:\/\/dribbble\.com\/([a-zA-Z0-9\-]+)(?:\?[^\/]+)?$/i;

export default {

    re: [
        /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i,
        PROFILE_RE
    ],

    mixins: ["*"],
    provides: ["isGif"],

    getMeta: function(url, og, twitter, isGif) {

        var meta = {};
        // Avoid canonical=gif for gif shots that invalidate thumbmails.
        if (isGif) {
            meta.canonical = url;
        }

        if (PROFILE_RE.test(url) || og.video || twitter.player || isGif) {
            // Wrap players into a promo card
            meta.medium = 'article';
        }

        return meta;
    },

    getLink: function(og, twitter, url, urlMatch, isGif) {
        var links = [];

        if (!isGif) {
            if (og.image
                && !og.video && !PROFILE_RE.test(url)) {
                links.push({
                    href: og.image.url || og.image,
                    type: CONFIG.T.image,
                    rel: CONFIG.R.image,
                    // No sizes here - validate image. Ex.: https://dribbble.com/shots/15050018-Player-platform
                });
            }


            // Twitter player is broken on GIFs: https://dribbble.com/shots/4240497-Wisdo-apps-video-introduction
            // 2022.07.05: Dribble player is broken now for all. IT comes with x-frame-option that allow only on Twitter.com
            /*
            if (twitter.player && twitter.player.width && twitter.player.height) {
                links.push({
                    href: twitter.player.value,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.gifv],
                    'aspect-ratio': twitter.player.width / twitter.player.height,
                })
            }
            */
        }

        return links;

        // The rest of links are well covered now by whitelist parsers + media=reader.
    },

    getData: function(og) {
        return {
            isGif: /\.gif/.test(og.url) || og.image && (/\.gif/.test(og.image.url || og.image))
        }
    },

    tests: [ {
        page: "http://dribbble.com/",
        selector: ".dribbble-link"
    }, {
        skipMethods: [
            "getMeta", "getLink"
        ]
    },
        "https://dribbble.com/shots/1311850-Winter-Is-Coming",
        "https://dribbble.com/shots/5030547-Chairs-Store-App",
        "https://dribbble.com/Sochnik",
        "https://dribbble.com/shots/5715634-Website-Banner-Slides",
        "https://dribbble.com/shots/14667116-Dark-Theme-UI-Elements-Design"
    ]
};
