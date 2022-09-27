export default {

    re: [
        /^https?:\/\/sverigesradio\.se\/sida\/(artikel)\.aspx\?programid=\d+&artikel=(\d+)/i,
        /^https?:\/\/sverigesradio\.se\/(artikel)\/(\d+)\/?(?:\?.+)?$/i,
        /^https?:\/\/sverigesradio\.se\/(artikel)\/([^\/]+)(?:\?.+)?$/i,
        /^https?:\/\/sverigesradio\.se\/embed\/(publication|episode)\/(\d+)/i,
        /^https?:\/\/sverigesradio\.se\/(avsnitt)\/(\d+)\/?(?:\?.+)?$/i,
        /^https?:\/\/sverigesradio\.se\/(avsnitt)\/([^\/]+)(?:\?.+)?$/i,
    ],

    provides: 'sveriges',

    mixins: [
        // oEmbed returns "non-starting" player too - https://sverigesradio.se/avsnitt/1966906
        "twitter-title",
        "twitter-description",
        "twitter-site",
        "twitter-image",
        "ld-newsarticle-logo",
        "ld-author",
        "ld-date",
        "canonical",
        "keywords",
        "media-detector",
        "theme-color",
        "favicon",
    ],

    getMeta: function(sverigies) {
        return {
            title: sveriges.title,
            description: sveriges.description
        }
    },

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

    tests: [
        "https://sverigesradio.se/artikel/5848335",
        "https://sverigesradio.se/artikel/6573606",
        "https://sverigesradio.se/artikel/professorn-om-rymdbilden-det-ar-hisnande",
        "https://sverigesradio.se/avsnitt/1966906",
        "https://sverigesradio.se/embed/publication/6652202",
        "https://sverigesradio.se/embed/publication/8087725",
        // Not embeddable: "https://sverigesradio.se/embed/episode/1966906",
        "https://sverigesradio.se/avsnitt/nikola-tesla-elektricitetspionjaren-som-glomdes-bort"
        // Not embeddable: https://sverigesradio.se/artikel/4351444
    ]
};