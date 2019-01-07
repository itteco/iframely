module.exports = {

    re: [
        /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/dribbble\.com\/([a-zA-Z0-9\-]+)(?:\?[^\/]+)?$/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function(url, og) {

        // avoid canonical=gif for gif shots that invalidate thumbmails
        if (/\.gif/.test(og.url)) {
            return {
                canonical: url
            }
        }
    },

    getLink: function(meta, url, urlMatch, cb) {

        if (meta.og && meta.og.image) {

            var links = [{
                href: meta.og.image.url || meta.og.image,
                type: CONFIG.T.image,
                rel: meta.og.type === 'profile'? [CONFIG.R.image, CONFIG.R.promo] : CONFIG.R.image,
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            }];

            if (meta.twitter && meta.twitter.player && /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i.test(url)) {
                links.push({
                    href: meta.twitter.player.value,
                    media: {
                        width: meta.twitter.player.width,
                        height: meta.twitter.player.height,
                        'max-width': 800
                    }, 
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.gifv, CONFIG.R.html5, CONFIG.R.twitter, 'responsive']
                });
            }

            cb(null, links);

        } else {
            // Attachments pages doesn't have any meta at the moment :\
            cb ({
                redirect: urlMatch[0] + urlMatch[1]
            });

        }
    },

    tests: [ {
        page: "http://dribbble.com/",
        selector: ".dribbble-link"
    }, {
        skipMethods: [
            "getMeta"
        ]
    },
        "http://dribbble.com/shots/1311850-Winter-Is-Coming",
        "http://dribbble.com/shots/5030547-Chairs-Store-App"
    ]
};
