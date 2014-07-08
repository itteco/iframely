module.exports = {

    re: /^http:\/\/www\.c-span\.org\/video\/\?([\d-]+)\/[\w-]+/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch, cheerio) {
        var id$ = cheerio("#video-embed[data-progid]");

        if (id$.length) {
            var program_id = id$.attr('data-progid');
            return {
                href: 'http://static.c-span.org/assets/swf/CSPANPlayer.1399044287.swf?pid=' + urlMatch[1] + '&system=http://www.c-span.org/common/services/flashXml.php?programid=' + program_id,
                rel: CONFIG.R.player,
                type: CONFIG.T.flash,
                'aspect-ratio': 1024/616
            };

        }
    },

    tests: [{
        page: 'http://www.c-span.org/search/',
        selector: '.onevid a.thumb'
    },
        "http://www.c-span.org/video/?306629-5/law-sea-treaty"
    ]

};