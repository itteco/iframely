module.exports = {

    re: /^https?:\/\/(?:[\w\-]+\.)?genius\.com\/(?!jobs)([a-zA-Z0-9\-]+)/i,    

    mixins: [ 
        "domain-icon",
        "*"
    ],

    getLinks: function(urlMatch, twitter) {
        var id = twitter.app.url.iphone.match(/\d+/)[0];

        if (id) {

            return {
                html: '<div id="rg_embed_link_' + id + '" class="rg_embed_link" data-song-id="' + id + '"></div><script src="//genius.com/songs/' + id + '/embed.js?dark=1"></script>',

                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.ssl]
            };
        }
    },

    tests: [{
        page: 'http://rap.genius.com/',
        selector: '.song_link'
    }, { skipMixins: ["favicon"]},
        "http://rock.genius.com/Bruce-springsteen-4th-of-july-asbury-park-sandy-lyrics",
        "http://rap.genius.com/Beyonce-flawless-remix-lyrics"
    ]
};