const PROFILE_RE = /^https?:\/\/dribbble\.com\/([a-zA-Z0-9\-]+)(?:\?[^\/]+)?$/i;

module.exports = {

    re: [
        /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i,
        PROFILE_RE
    ],

    mixins: ["*"],

    highestPriority: true,

    getMeta: function(url, og) {

        var meta = {};
        // Avoid canonical=gif for gif shots that invalidate thumbmails.
        if (/\.gif/.test(og.url)) {
            meta.canonical = url;
        }

        if (PROFILE_RE.test(url)) {
            // Wrap players into a promo card
            meta.media = 'reader';
        }

        return meta;
    },

    getLink: function(meta, url, urlMatch) {

        if (meta.og && meta.og.image && !meta.og.video) {
            return {
                href: meta.og.image.url || meta.og.image,
                type: CONFIG.T.image,
                rel: !PROFILE_RE.test(url) && !meta.og.video ? [CONFIG.R.image, CONFIG.R.promo] : CONFIG.R.image,
                width: meta.og.image.width,
                height: meta.og.image.height
            };
        }

        // The rest of links are well covered now by whitelist parsers + media=reader for profiles.
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
        "https://dribbble.com/shots/5715634-Website-Banner-Slides"
    ]
};
