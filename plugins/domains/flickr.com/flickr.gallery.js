module.exports = {

    re: /^https?:\/\/www\.flickr\.com(\/photos\/[@a-zA-Z0-9_\.]+\/sets\/(\d+))/i,

    mixins: [
        "og-title",
        "canonical",
        "og-site",
        "twitter-description",
        "twitter-author",

        "favicon",
        "og-image"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'https://www.flickr.com/apps/slideshow/show.swf?v=143270&offsite=true&lang=en-us&page_show_url=' + encodeURIComponent(urlMatch[1] + '/show/') + '&page_show_back_url=' + encodeURIComponent(urlMatch[1] + '/') + '&set_id=' + encodeURIComponent(urlMatch[2]) + '&jump_to=',
            type: CONFIG.T.flash,
            rel: CONFIG.R.player
        };
    },

    tests: [
        {
            // Flickr sets feed.
            page: "http://www.flickr.com/photos/jup3nep/sets/",
            selector: "a.photo-list-album"
        },
        "http://www.flickr.com/photos/jup3nep/sets/72157603856136177/",
        {
            skipMixins: [
                "twitter-author",
                "twitter-description"
            ]
        }
    ]
};