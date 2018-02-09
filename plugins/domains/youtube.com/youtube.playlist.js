module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?list=([\-_a-zA-Z0-9]+)/i
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "og-description",
        "canonical",
        "domain-icon"
    ],    

    getLinks: function(urlMatch, oembed, options) {

        var params = options.getProviderOptions('youtube.playlist_params', '');

        return {
            href: 'https://www.youtube.com/embed/videoseries?list=' + urlMatch[1] + params.replace(/^\?/, '&'),
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width && oembed.height ? oembed.width / oembed.height : 16/9,
            autoplay: 'autoplay=1'
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};
