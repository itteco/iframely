module.exports = {

    getLink: function(cheerio, __allowEmbedURL) {

        var $el = cheerio('[itemprop="embedURL"]');
        if ($el.length) {
            var uri = $el.attr('content') || $el.attr('href');

            if (uri) {
                return {
                    href: uri,
                    type: CONFIG.T.text_html,
                    rel: CONFIG.R.player
                };
            }
        }
    }
};