const decodeHTML5 = require('entities').decodeHTML5;
const utils = require('../../../lib/utils');

module.exports = {

    provides: 'schemaVideoObject',

    getData: function(cheerio, decode, __allowEmbedURL) {

        /* Let's try to find ld+json in the body first. */
        var $script = cheerio('script[type="application/ld+json"]:contains("VideoObject")').first(); // embedURL can be embedurl, embedUrl, etc.

        if ($script.length === 1) {
            try {
                var json = utils.parseJSONSource($script.text());

                if (json['@type']) {
                    ld = {};
                    ld[json['@type'].toLowerCase()] = json;

                    if (__allowEmbedURL !== 'skip_ld') {
                        return {
                            ld: ld
                        }
                    } else if (ld.videoobject || ld.mediaobject) {
                        var videoObject = ld.videoobject || ld.mediaobject,
                            href = videoObject.embedURL || videoObject.embedUrl || videoObject.embedurl;

                        if (href) {
                            return {
                                schemaVideoObject: ld.videoobject || ld.mediaobject
                            }
                        } // else check microformats, ex.: cbssports
                    }
                }

            } catch (ex) {
                // broken json, c'est la vie
                // let's try microformats instead
            }
        }

        /* Else, the ld above didn't return any results. Let's try microformats. */
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
        /* End of microformats. */
    },

    getLinks: function(schemaVideoObject, whitelistRecord) {        

        var links = [];
        
        var thumbnailURL = schemaVideoObject.thumbnail || schemaVideoObject.thumbnailURL || schemaVideoObject.thumbnailUrl || schemaVideoObject.thumbnailurl;
        if (thumbnailURL) {
            links.push({
                href: thumbnailURL,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image            
            });
        }

        if (!whitelistRecord.isAllowed('html-meta.embedURL')) {return links;}

        var href = schemaVideoObject.embedURL || schemaVideoObject.embedUrl || schemaVideoObject.embedurl;

        if (href) {
            var player = {
                href: whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.ssl) ? href.replace(/^http:\/\//i, '//') : href,
                rel: [CONFIG.R.player],
                accept: whitelistRecord.isDefault ? ['video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl] : [CONFIG.T.text_html, CONFIG.T.flash, 'video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl]
            };

            if (whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.html5)) {
                player.rel.push(CONFIG.R.html5);
            }
            if (whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.autoplay)) {
                player.rel.push(CONFIG.R.autoplay);
            }

            if (whitelistRecord.isAllowed('html-meta.embedURL', 'responsive') || !schemaVideoObject.height) {
                player["aspect-ratio"] = schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : CONFIG.DEFAULT_ASPECT_RATIO;
                player.scrolling = 'no';
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
                accept: ['video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl], // detects and validates mime type
                rel: CONFIG.R.player, // HTML5 will come from mp4, if that's the case
                'aspect-ratio': schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : CONFIG.DEFAULT_ASPECT_RATIO
            });
        }

        return links;
    }

};