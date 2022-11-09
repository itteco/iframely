export default {

    re: /^https?:\/\/(?:www\.)?ted\.com\/playlists\//i,

    mixins: [
        "*"
    ],

    // oEmbed doesn't support playlists yet. Thus, the workaround. 
    getLink: function(urlMatch, og) {        
        
        if (/\/playlists\//.test(og.url)) {
            return {
                href: og.url.replace(/^https?:\/\/(www\.)?/i, "https://embed-ssl.").replace(/\?[^\/]+$/, ''),
                accept: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                // defaault "aspect-ratio"
            }
        }
    },

    tests: [
        "https://www.ted.com/playlists/24/re_imagining_school",
        "https://www.ted.com/playlists/318/fascinating_history"
    ]
};