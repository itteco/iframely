export default {

    re: [
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/sida\/(artikel)\.aspx\?programid=\d+&artikel=(\d+)/i,
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/(artikel)\/(\d+)\/?(?:\?.+)?$/i,
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/(artikel)\/([^\/]+)(?:\?.+)?$/i,
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/embed\/(publication|episode)\/(\d+)/i,
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/(avsnitt)\/(\d+)\/?(?:\?.+)?$/i,
        /^https?:\/\/(?:www\.)?sverigesradio\.se\/(avsnitt)\/([^\/]+)(?:\?.+)?$/i,
    ],

    provides: 'sveriges',

    mixins: ["*"],

    getLink: function(sveriges) {

        if (sveriges.canBeEmbedded) {

            return {
                href: sveriges.embedUrl,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.audio],
                'min-width': 210,
                height: 150
            }

        } else {            
            return { 
                message: "This Sveriges Radio player won't play when embedded"
            }
            // And no fallback to generic oEmbed
        }
    },

    getData: function(url, urlMatch, request, cheerio, cb) {

        var id = urlMatch[2],
            type = urlMatch[1] === 'avsnitt' || urlMatch[1] === 'episode' ? 'episode' : 'article';

        if (!/^\d+$/.test(id)) {
            var $el = cheerio('#gtm-metadata');
            if ($el.length == 1) {
                const gtm = JSON.parse($el.text());
                id = gtm.pageId;

                if (!id) {
                    return cb(null);
                }
            }
        }

        request({
            uri: `https://sverigesradio.se/share/${type}/${id}`,
            prepareResult: function(error, response, body, cb) {

                if (error || response.statusCode !== 200) {
                    return cb(null);
                } else {
                    if (/\/embed\//.test(url) && body.url && body.url !== url) {
                        cb({redirect: body.url});
                    } else {
                        cb(null, {
                            sveriges: body
                        });
                    }
                }
            }
        }, cb);
    },

    tests: [{skipMixins: ['keywords']},
        "https://sverigesradio.se/artikel/5448332",
        "https://sverigesradio.se/artikel/6573606",
        "https://sverigesradio.se/play/artikel/8936167",
        "https://sverigesradio.se/artikel/professorn-om-rymdbilden-det-ar-hisnande",
        "https://www.sverigesradio.se/artikel/personal-doms-for-stold-av-smycken-varda-200-000-kronor-fran-aldreboende",
        "https://sverigesradio.se/embed/publication/6652202",
        "https://sverigesradio.se/embed/publication/8087725",
        "https://sverigesradio.se/avsnitt/2568806",
        "https://sverigesradio.se/avsnitt/nikola-tesla-elektricitetspionjaren-som-glomdes-bort"
        // Not embeddable: https://sverigesradio.se/artikel/4351444
        // Not embeddable: "https://sverigesradio.se/embed/episode/1966906",
    ]
};