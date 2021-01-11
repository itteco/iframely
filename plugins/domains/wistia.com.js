module.exports = {

    re: /^https?:\/\/([a-zA-Z0-9]+).wistia\.com\/medias\/([_a-zA-Z0-9]+)/i,

    mixins: [
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-duration",
    ],

    getMeta: function(oembed) {
        return {
            'theme-color': oembed.player_color
        }
    },

    getLinks: function(oembed, urlMatch, url) {

        var icon = {
            href: "https://wistia.com/static/favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon     
        }

        if (oembed.type === 'video') { 

            var params = "";
            // Extract  ?start=123
            var start = url.match(/(?:start|time)=(\d+)/i);
            if (start) {
                params =  "?time=" + start[1];
            }

            return [{
                href: "https://fast.wistia.net/embed/iframe/" + urlMatch[2] + params,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height,
                autoplay: "autoPlay=true"
            }, icon];

        } else if (oembed.type === 'audio') { // Not in spec, but let it be
            return [{
                html: oembed.html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5, CONFIG.R.inline],
                height: 218
            }, icon];

        } else if (oembed.type === 'photo') { 
            // Photo also handled well via fallback to generic. 
            // But it will be faster via domain plugin.
            return [{
                href: oembed.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail],
            }, icon];
        }
        // else - 'rich' is currently not used any longer (was used for 'audio' before).
    },


    tests: [{
        noFeeds: true,
        skipMixins: ["oembed-thumbnail", "oembed-duration"],
        skipMethods: ["getMeta"]
    },
        "https://appsumo.wistia.com/medias/fudkgyoejs",
        "https://shluchim.wistia.com/medias/l0mkqobjda",
        "https://signalophthalmic.wistia.com/medias/hfqfnxk3yb"
    ]
};