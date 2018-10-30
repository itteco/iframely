module.exports = {

    re: /^https?:\/\/([a-zA-Z0-9]+).wistia\.com\/medias\/([_a-zA-Z0-9]+)/i,

    mixins: [
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-duration"
    ],

    getLinks: function(oembed, urlMatch, url) {

        if (oembed.type === 'video') { 

            var params = "";
            // Extract  ?start=123
            var start = url.match(/(?:start|time)=(\d+)/i);
            if (start) {
                params =  "?time=" + start[1];
            }

            return [{
                href: "//fast.wistia.net/embed/iframe/" + urlMatch[2] + params,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height,
                autoplay: "autoPlay=true"
            }, {
                href: "http://wistia.com/favicon.ico",
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
            }];
        } // else - 'rich' is for audio embeds. Let it fall back to generic parsers
    },


    tests: [{
        noFeeds: true
    },
        "http://appsumo.wistia.com/medias/fudkgyoejs"
    ]
};