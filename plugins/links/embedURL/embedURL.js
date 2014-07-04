module.exports = {

    provides: 'schemaVideoObject',

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
                schemaVideoObject: result
            };
        }
    },

    // TODO: parse duration

    getLink: function(schemaVideoObject, whitelistRecord) {

        if (schemaVideoObject.embedURL || schemaVideoObject.embedUrl) {

            var type = CONFIG.T.text_html;

            if (schemaVideoObject.playerType) {
                if (schemaVideoObject.playerType.indexOf('Flash') > -1) {
                    type = CONFIG.T.flash;
                }
            }

            var player = {
                href: schemaVideoObject.embedURL || schemaVideoObject.embedUrl,
                rel: [CONFIG.R.player],
                type: type
            };

            if (whitelistRecord.isAllowed('html-meta.embedURL', 'html5')) player.rel.push(CONFIG.R.html5);
            if (whitelistRecord.isAllowed('html-meta.embedURL', 'autoplay')) player.rel.push(CONFIG.R.autoplay);

            if (whitelistRecord.isAllowed('html-meta.embedURL', 'responsive') || !schemaVideoObject.height) {
                player["aspect-ratio"] = schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : 4/3;
            } else {
                player.width = schemaVideoObject.width;
                player.height = schemaVideoObject.height;
            }

            return [player, {
                href: schemaVideoObject.thumbnail || schemaVideoObject.thumbnailURL || schemaVideoObject.thumbnailUrl,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image            
            }]
        }

    }
};