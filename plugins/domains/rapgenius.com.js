module.exports = {

    re: /^https?:\/\/(?:[\w\-]+\.)?genius\.com\/(?!jobs)([a-zA-Z0-9\-]+)/i,    

    mixins: [ 
        "domain-icon",
        "*"
    ],

    getLinks: function(urlMatch, meta, options) {

        if (/\d+/.test(meta['newrelic-resource-path'])) {

            var id = meta['newrelic-resource-path'].match(/\d+/)[0];
            var theme = options.getRequestOptions('players.theme', 'light');

            return {
                html: '<div id="rg_embed_link_' + id + '" class="rg_embed_link" data-song-id="' + id + '"></div><script src="//genius.com/songs/' + id + '/embed.js' + 
                (theme === 'dark' ? '?dark=1' : '') +'"></script>',

                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl],
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

    tests: [{
        page: 'https://genius.com/',
        selector: '#top-songs a.chart_row'
    }, { skipMixins: ["favicon"]},
        "http://rock.genius.com/Bruce-springsteen-4th-of-july-asbury-park-sandy-lyrics",
        "http://rap.genius.com/Beyonce-flawless-remix-lyrics"
    ]
};