export default {

    re: /^https?:\/\/www\.flickr\.com(\/photos\/[@a-zA-Z0-9_\.\-]+\/(?:sets|albums)\/(\d+))/i,    

    mixins: [
        "oembed-thumbnail",
        "domain-icon",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "og-description"
    ],

    getLink: function(urlMatch, oembed, options) {

        var html = oembed.html;

        var opts = {
            header: options.getRequestOptions('flickr.header', /data-header=\"true\"/i.test(html)),
            footer: options.getRequestOptions('flickr.footer', /data-footer=\"true\"/i.test(html)),
        };

        var key; // thanks jslint
        for (key in opts) {
            html = html.replace(new RegExp('\\s?data\\-' + key + '="(true|false)"'), '');
            if (opts[key]) {
                html = html.replace("data-flickr-embed='true'", "data-flickr-embed='true' data-" + key + "='true'");
            }
        }

        return {
            html: html
                .replace(/\@n/g, "@N")
                .replace(/width=\"\d+\" height=\"\d+\" alt/, 'width="100%" alt'),
            rel: [CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width / oembed.height,
            options: {
                header: {
                    label: 'Show user header',
                    value: opts.header
                },
                footer: {
                    label: 'Show description footer',
                    value: opts.footer
                }
            }
        };
    },

    tests: [
        {
            // Flickr sets feed.
            page: "http://www.flickr.com/photos/jup3nep/sets/",
            selector: "a.photo-list-album"
        },
        "http://www.flickr.com/photos/jup3nep/sets/72157603856136177/",
        "https://www.flickr.com/photos/marshal-banana/albums/72157661935064149",
        "https://www.flickr.com/photos/mediacult/albums/72157703180229901",
        {
            skipMixins: [
                "twitter-author",
                "twitter-description"
            ]
        }
    ]
};