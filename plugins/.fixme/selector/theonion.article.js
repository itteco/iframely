module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: /^http:\/\/www\.theonion\.com\/article\/*/i,

    mixins: [
        "canonical",
        "favicon",
        "og-image",
        "copyright",
        "og-description",
        "og-title"
    ],

    getLink: function(cheerio) {

        var $html = cheerio('article.full-article')

        if ($html.length) {

            var $image = cheeio('figure.article-image img');

            var html = '';

            if ($image.length) {
                html = $image.parent().html();
            }

            html += $html.html();

            return {
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    },

    tests: [{
        page: "http://www.theonion.com/section/politics/",
        selector: "a.title"
    }]
};