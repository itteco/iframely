module.exports = {

    re: /^https?:\/\/www\.flickr\.com(\/photos\/[@a-zA-Z0-9_\.\-]+\/(?:sets|albums)\/(\d+))/i,    

    mixins: [
        "oembed-thumbnail",
        "domain-icon",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "og-description"
    ],

    getLink: function(urlMatch, oembed) {
        return [{
            href: 'https://www.flickr.com/apps/slideshow/show.swf?v=143270&offsite=true&lang=en-us&page_show_url=' + encodeURIComponent(urlMatch[1] + '/show/') + '&page_show_back_url=' + encodeURIComponent(urlMatch[1] + '/') + '&set_id=' + encodeURIComponent(urlMatch[2]) + '&jump_to=',
            type: CONFIG.T.flash,
            rel: CONFIG.R.player
        }, {
            html: oembed.html
                .replace(/\@n/g, "@N")
                .replace(/width=\"\d+\" height=\"\d+\" alt/, 'width="100%" alt'),
            rel: [CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width / oembed.height            
        }];
    },

    tests: [
        {
            // Flickr sets feed.
            page: "http://www.flickr.com/photos/jup3nep/sets/",
            selector: "a.photo-list-album"
        },
        "http://www.flickr.com/photos/jup3nep/sets/72157603856136177/",
        "https://www.flickr.com/photos/marshal-banana/albums/72157661935064149",
        {
            skipMixins: [
                "twitter-author",
                "twitter-description"
            ]
        }
    ]
};