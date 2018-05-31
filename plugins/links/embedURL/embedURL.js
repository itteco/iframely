const decodeHTML5 = require('entities').decodeHTML5;

module.exports = {

    provides: 'schemaVideoObject',

    getData: function(cheerio, decode, __allowEmbedURL) {

        var videoObjectSchema = 'Object';

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
                    var value = decodeHTML5(decode($el.attr('content') || $el.attr('href')));
                    result[key] = value;
                }
            });

            return {
                schemaVideoObject: result
            };
        }
    },

    getLinks: function(schemaVideoObject, whitelistRecord) {

        if (!whitelistRecord.isAllowed('html-meta.embedURL')) {return;}

        var links = [];
        
        var thumbnailURL = schemaVideoObject.thumbnail || schemaVideoObject.thumbnailURL || schemaVideoObject.thumbnailUrl || schemaVideoObject.thumbnailurl;
        if (thumbnailURL) {
            links.push({
                href: thumbnailURL,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image            
            });
        }

        var href = schemaVideoObject.embedURL || schemaVideoObject.embedUrl || schemaVideoObject.embedurl;
        if (href) {
            var player = {
                href: whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.ssl) ? href.replace(/^http:\/\//i, '//') : href,
                rel: [CONFIG.R.player],
                accept: whitelistRecord.isDefault ? ['video/*', 'application/vnd.apple.mpegurl', 'application/x-mpegurl'] : [CONFIG.T.text_html, CONFIG.T.flash, 'video/*', 'application/vnd.apple.mpegurl', 'application/x-mpegurl']
            };

            if (whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.html5)) {
                player.rel.push(CONFIG.R.html5);
            }
            if (whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.autoplay)) {
                player.rel.push(CONFIG.R.autoplay);
            }

            if (whitelistRecord.isAllowed('html-meta.embedURL', 'responsive') || !schemaVideoObject.height) {
                player["aspect-ratio"] = schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : CONFIG.DEFAULT_ASPECT_RATIO;
            } else {
                player.width = schemaVideoObject.width;
                player.height = schemaVideoObject.height;
            }

            links.push(player);
        }

        var contentURL = schemaVideoObject.contentURL || schemaVideoObject.contentUrl || schemaVideoObject.contenturl;
        if (contentURL) {
            links.push({
                href: contentURL,
                accept: ['video/*', 'application/vnd.apple.mpegurl', 'application/x-mpegurl'], // detects and validates mime type
                rel: CONFIG.R.player, // HTML5 will come from mp4, if that's the case
                'aspect-ratio': schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : CONFIG.DEFAULT_ASPECT_RATIO
            });
        }

        return links;
    }

};