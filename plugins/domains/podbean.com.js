module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-title"
    ],

    getLink: function(url, cheerio) {

        // Iframe with video embed.
        var $iframe = cheerio('.podPress_content iframe');
        if ($iframe.length) {
            return {
                href: $iframe.attr('src').replace('http://', '//'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                width: $iframe.attr('width'),
                height: $iframe.attr('height')
            };
        }

        // Generate audio embed.
        var $post = cheerio('.post-toolbar');
        if ($post.length) {
            var id_match = $post.attr('id').match(/postbar_(\d+)/);

            if (id_match) {
                return {
                    href: '//www.podbean.com/media/player/audio/postId/' + id_match[1] + '/url/' + encodeURI(url) + '/initByJs/1/auto/1',
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    'min-width': 225,
                    height: 100
                };
            }
        }
    },

    tests: [{
        pageWithFeed: 'http://boyt.podbean.com'
    }, {
        pageWithFeed: 'http://anfieldindex.podbean.com'
    }, {
        skipMixins: ['keywords', 'favicon']
    },
        "http://realenglishconversations.podbean.com/e/english-podcast-17-our-personal-story-real-english-conversations/",
        "http://thehashtaghunter.podbean.com/e/law-of-attraction/"
    ]
};