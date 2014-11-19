module.exports = {

    re: /^https?:\/\/(?:[\w\-]+\.)?genius\.com\/(?!jobs)([a-z-]+)/i,

    mixins: [
        "og-image",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch, twitter) {
        var id = twitter.app.url.iphone.match(/\d+/)[0];
        return {
            html: '<div id="rg_embed_link_' + id + '" class="rg_embed_link">Read <a href="http://rapgenius.com/D12-my-band-lyrics">' + twitter.title + '</a> on Genius</div><script src="//' + urlMatch[1] + '.genius.com/songs/' + id + '/embed.js?dark=1"></script>',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline]
        };
    },

    tests: [
        "http://rock.genius.com/Bruce-springsteen-4th-of-july-asbury-park-sandy-lyrics",
        "http://rap.genius.com/Beyonce-flawless-remix-lyrics"
    ]
};