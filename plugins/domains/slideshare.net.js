export default {

    mixins: [
        // "*" // Linking to * will enable oembed-rich and will result in incorrect aspect-ratios
        "twitter-image",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "canonical",
        "description",
        "oembed-site",
        "oembed-title",
        "oembed-iframe",
    ],

    getLink: function(oembed, iframe, utils, options, cb) {

        if (iframe.src && oembed.slide_image_baseurl && oembed.slide_image_baseurl_suffix) {

            var firstSlide = (/^\/\//.test(oembed.slide_image_baseurl) ? 'http:' : '') + oembed.slide_image_baseurl + '1' + oembed.slide_image_baseurl_suffix;

            utils.getImageMetadata(firstSlide, options, function(error, data) {

                if (error || data.error || !data.width || !data.height) {

                    return cb('Error getting first slide for Slideshare: ' + error);

                } else {

                    var aspect = (data.width && data.height) ? data.width / data.height : oembed.width / oembed.height;

                    return cb(null, [{
                            href: firstSlide,
                            type: CONFIG.T.image, 
                            rel: CONFIG.R.thumbnail,
                            width: data.width,
                            height: data.height
                        }, {
                            href: oembed.thumbnail,
                            type: CONFIG.T.image,
                            rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                            width: oembed.thumbnail_width,
                            height: data.height ? Math.round (oembed.thumbnail_width / (data.width / data.height)) : oembed.thumbnail_height
                        }, {
                            href: iframe.src,
                            type: CONFIG.T.text_html,
                            rel: [aspect > 1 ? CONFIG.R.player : CONFIG.R.reader, CONFIG.R.slideshow],
                            "aspect-ratio": aspect,
                            "padding-bottom": 58
                        }
                    ]);
                }

            });
        } else {
            cb(null, null);
        }

    },

    getData: function(url, oembedError) {

        if (/^https?:\/\/(?:www\.)?slideshare\.net\/secret\//i.test(url) /* && oembedError */) {
            return {
                message: 'This content has been marked as private by the uploader.'
            }
        }

    },

    tests: [{
        page: "https://www.slideshare.net/explore",
        selector: ".slideshow-card a.bg-img-container",
        getUrl: function(url) {
            return /^https:\/\/www\.slideshare\.net\/[^\/]+\/[^\/]+\-\d+/i.test(url);
        }
    }, {skipMethods: ["getData"]},
        "https://www.slideshare.net/DataReportal/digital-2020-global-digital-overview-january-2020-v01-226017535",
        "https://www.slideshare.net/EnjoyDigitAll/le-design-thinking-by-enjoydigitall-71136562",
        "https://www.slideshare.net/DILGNaga/participatory-situational-analysispptx",
        "https://www.slideshare.net/cbo/dynamic-scoring-at-cbo-53071719"
    ]
};