module.exports = {

    provides: 'schemaVideoObject',

    getData: function(cheerio, __allowEmbedURL) {

        var videoObjectSchema = 'VideoObject';

        var $scope = cheerio('[itemscope][itemtype*="' + videoObjectSchema + '"]');

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
                if (!($parentScope.attr('itemtype').indexOf(videoObjectSchema) > -1)) {
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

    // TODO: Duration (convert format PY0M0D0TH0M2S36 into ours)

    getLink: function(schemaVideoObject, whitelistRecord) {

        if (schemaVideoObject.embedURL || schemaVideoObject.embedUrl) {

            var type = CONFIG.T.text_html;

            if (schemaVideoObject.playerType) {
                if (schemaVideoObject.playerType.toLowerCase().indexOf('Flash') > -1) {
                    type = CONFIG.T.flash;
                }
            } else if (schemaVideoObject.encodingFormat) {
                if (schemaVideoObject.encodingFormat.toLowerCase().indexOf('mp4') > -1) {
                    type = CONFIG.T.video_mp4;
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