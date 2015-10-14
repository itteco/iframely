module.exports = {

    re: /^http:\/\/www\.cbsnews\.com\/videos\/[a-z0-9-]+\//i,

    mixins: [
        "favicon",
        "canonical",
        "keywords",
        "media-detector",
        "twitter-image",
        "twitter-description",
        "twitter-title"
    ],

    getLink: function(cheerio) {

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
                href: result.embedURL.replace(/&amp;/g, '&') + '&autoplay=true',
                type: CONFIG.T.flash,
                rel: [CONFIG.R.player, CONFIG.R.autoplay],
                'aspect-ratio': result.width / result.height
            };
        }
    },

    tests: [{
        feed: 'http://www.cbsnews.com/latest/rss/video'
    },
        "http://www.cbsnews.com/videos/hurricane-katrina-photographer-new-orleans-on-road-to-recovery/"
    ]

};