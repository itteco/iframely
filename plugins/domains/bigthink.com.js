export default {

    mixins: [
        "*"
    ],

    getData: function(cheerio, cb) {
        var $el = cheerio('mux-player[src*="cdn.jwplayer.com/manifests/"]');
        var media_re = /cdn\.jwplayer\.com\/manifests\/(\w+)\.m3u8$/i;

        var src = $el.attr('src');
        var match = src && src.match(media_re);

        if (match) {
            cb(null, {
                __promoUri: `https://content.jwplatform.com/players/${match[1]}.html`
            });
        } else {
            cb(null);
        }
    },

    tests: [
        "https://bigthink.com/videos/bre-pettis-on-makerbot-3-d-printing",
        "https://bigthink.com/videos/vivek-wadhwa-every-industry-will-be-disrupted",
        "https://bigthink.com/the-present/neil-degrasse-tyson-life-on-europa-jupiters-icy-moon/",
        "https://bigthink.com/the-present/how-can-cognitive-science-inform-the-future-of-education/",
        "https://bigthink.com/the-present/systemic-racism-in-schools/",
        "https://bigthink.com/series/the-big-think-interview/tiago-forte",
    ]
};