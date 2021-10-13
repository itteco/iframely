export default {

    re: /^https?:\/\/(?:www\.)?ted\.com\/playlists\//i,

    mixins: [
        "og-image",
        "favicon",
        "author",
        "canonical",
        "og-description",
        "keywords",
        "og-title"
    ],

    getLink: function(urlMatch, og) {
        // oEmbed doesn't support playlists yet. Thus, the workaround. 
        
        if (/\/playlists\//.test(og.url)) {

            return {
                href: og.url.replace(/^https?:\/\/(www\.)?/i, "https://embed-ssl.").replace(/\?[^\/]+$/, ''),
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 4/3
            }
        }
    },

    tests: [
        "http://www.ted.com/playlists/24/re_imagining_school"
    ]
};