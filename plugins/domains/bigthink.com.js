module.exports = {

    mixins: [
        "*"
    ],

    getData: function(ld, cheerio, cb) {
        var $el = cheerio('head script[src*="cdn.jwplayer.com"]');
        var player_re = /jwplayer.com\/libraries\/(\w+)\.js$/i;
        var media_re = /jwplayer.com\/v\d+\/media\/(\w+)\/poster\.jpg$/i;

        if ($el.length > 0 
            && player_re.test($el.attr('src'))
            && ld.article && ld.article.image 
            && media_re.test(ld.article.image.url)) {

            var player_id = $el.attr('src').match(player_re)[1];
            var media_id = ld.article.image.url.match(media_re)[1];

            cb (null, {
                __promoUri: `https://content.jwplatform.com/players/${media_id}-${player_id}.html`
            });
        } else {
            cb(null);
        }
    },

    tests: [
        "http://bigthink.com/videos/bre-pettis-on-makerbot-3-d-printing",
        "http://bigthink.com/videos/vivek-wadhwa-every-industry-will-be-disrupted",
        "https://bigthink.com/the-present/neil-degrasse-tyson-life-on-europa-jupiters-icy-moon/"
    ]
};