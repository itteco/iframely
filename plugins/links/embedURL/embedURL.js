import { decodeHTML5 } from 'entities';

export default {

    provides: 'schemaVideoObject',

    getData: function(url, cheerio, decode, __allowEmbedURL, utils) {

        /* Let's try to find ld+json in the body first. */
        const ldSelector = 'script[type="application/ld+json"]:contains("VideoObject"), script[type="application/ld&#x2B;json"]:contains("VideoObject")'
        var $script = cheerio(ldSelector).first(); // embedURL can be embedurl, embedUrl, etc.\

        if ($script.length === 1) {
            try {
                const ld = utils.parseLDSource($script.html(), decode, url);
                if (ld && __allowEmbedURL !== 'skip_ld') {
                    return {
                        ld: ld
                    }
                } else if (ld) {
                    const json = utils.findMainLdObjectWithVideo(ld);
                    if (json) {
                        return {
                            schemaVideoObject: json
                        }
                    } // else check microformats, ex.: cbssports
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

        var contentURL = schemaVideoObject.contentURL || schemaVideoObject.contentUrl || schemaVideoObject.contenturl;
        if (contentURL) {
            var accept = ['video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl];
            if (whitelistRecord.isAllowed('html-meta.embedURL', 'accept')) {
                accept.push(CONFIG.T.text_html);
            }
            
            links.push({
                href: contentURL,
                accept: accept, // detects and validates mime type
                rel: CONFIG.R.player, // HTML5 will come from mp4, if that's the case
                'aspect-ratio': schemaVideoObject.height ? schemaVideoObject.width / schemaVideoObject.height : CONFIG.DEFAULT_ASPECT_RATIO
            });
        }        

        if (whitelistRecord.isAllowed('html-meta.embedURL')) {

            var href = schemaVideoObject.embedURL || schemaVideoObject.embedUrl || schemaVideoObject.embedurl;

            if (href) {
                var player = {
                    href: whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.ssl) ? href.replace(/^http:\/\//i, '//') : href,
                    rel: [CONFIG.R.player],
                    accept: whitelistRecord.isDefault ? ['video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl] : [CONFIG.T.text_html, 'video/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl]
                };

                if (whitelistRecord.isAllowed('html-meta.embedURL', CONFIG.R.autoplay)) {
                    player.rel.push(CONFIG.R.autoplay);
                }

                if (whitelistRecord.isAllowed('html-meta.embedURL', 'responsive') || !schemaVideoObject.height) {
                    if (schemaVideoObject.width && schemaVideoObject.height) {
                        player["aspect-ratio"] = schemaVideoObject.width / schemaVideoObject.height;
                        player.scrolling = 'no';
                    }
                } else {
                    player.width = schemaVideoObject.width;
                    player.height = schemaVideoObject.height;
                }

                links.push(player);
            }
        }

        return links;
    }
};