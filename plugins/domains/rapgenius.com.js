export default {

    re: /^https?:\/\/(?:[\w\-]+\.)?genius\.com\/(?!jobs)([a-zA-Z0-9\-]+)/i,

    mixins: [ 
        "domain-icon",
        "*"
    ],

    getLinks: function(urlMatch, meta, options) {

        var id;

        if (meta.twitter && meta.twitter.app && meta.twitter.app.url && /songs\/(\d+)$/i.test(meta.twitter.app.url.iphone)) {
            id = meta.twitter.app.url.iphone.match(/songs\/(\d+)$/i)[1];
        } else if (/\d+/.test(meta['newrelic-resource-path'])) {
            id = meta['newrelic-resource-path'].match(/\d+/)[0]
        }

        if (id) {
            var theme = options.getRequestOptions('players.theme', 'light');

            return {
                html: '<div id="rg_embed_link_' + id + '" class="rg_embed_link" data-song-id="' + id + '"></div><script src="https://genius.com/songs/' + id + '/embed.js' + 
                (theme === 'dark' ? '?dark=1' : '') +'"></script>',

                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.ssl],
                options: {
                    theme: {
                        label: CONFIG.L.theme,
                        value: theme,
                        values: {
                            light: CONFIG.L.light,
                            dark: CONFIG.L.dark
                        }
                    }                    
                }
            };
        }
    },

    tests: [
        "https://genius.com/Bruce-springsteen-4th-of-july-asbury-park-sandy-lyrics",
        "https://genius.com/Beyonce-flawless-remix-lyrics",
        "https://genius.com/Mariah-carey-all-i-want-for-christmas-is-you-lyrics"
    ]
};