module.exports = {

    mixins: [
        "og-image",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(og, twitter) {
        var id = twitter.app.url.iphone.match(/\d/)[0];
        return {
            html: '<div id="rg_embed_link_' + id + '" class="rg_embed_link">Read <a href="http://rapgenius.com/D12-my-band-lyrics">' + og.title + '</a> on Rap Genius</div><script src="//rapgenius.com/songs/' + id + '/embed.js?dark=1"></script>',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app
        };
    },

    tests: [{
        page: 'http://rapgenius.com/',
        selector: 'a.song_link'
    },
        "http://rock.rapgenius.com/Bruce-springsteen-4th-of-july-asbury-park-sandy-lyrics"
    ]
};