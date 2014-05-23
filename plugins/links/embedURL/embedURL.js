module.exports = {

    provides: 'microformatVideoObject',

    getData: function(cheerio, __allowEmbedURL) {

        var videoObjectSchema = 'http://schema.org/VideoObject';

        var $scope = cheerio('[itemscope][itemtype="' + videoObjectSchema + '"]');

        if ($scope.length) {

            var $aScope = cheerio($scope);

            var result = {};

            $aScope.find('[itemprop]').each(function() {
                var $el = cheerio(this);

                var scope = $el.attr('itemscope');
                if (typeof scope !== 'undefined') {
                    return;
                }

                var $parentScope = $el.parents('[itemscope]');
                if ($parentScope.attr('itemtype') !== videoObjectSchema) {
                    return;
                }

                var key = $el.attr('itemprop');
                if (key) {
                    var value = $el.attr('content') || $el.attr('href');
                    result[key] = value;
                }
            });

            return {
                microformatVideoObject: result
            };
        }
    },

    // TODO: parse duration

    getLink: function(microformatVideoObject) {

        if (microformatVideoObject.embedURL) {
            return {
                href: microformatVideoObject.embedURL,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                width: microformatVideoObject.width,
                height: microformatVideoObject.height
            };
        }
    }
};