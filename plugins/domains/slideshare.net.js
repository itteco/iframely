import * as utils from '../../lib/utils.js';
import cheerio_pkg from 'cheerio';
const $ = cheerio_pkg.default;

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
            "oembed-title"
    ],

    getMeta: function(meta) {

        if (meta.slideshare) {
            var data = meta.slideshare;
            return {
                views: data.view_count,
                date: data.published || data.created_at || data.updated_at,
                category: data.category,
                likes: data.favorites_count,
                author_url: /^https:\/\//.test(data.author) ? data.author : null
            }
        }

    },

    getLink: function(oembed, options, cb) {

        if (oembed.slide_image_baseurl && oembed.slide_image_baseurl_suffix) {
            var links = [];

            var firstSlide = (/^\/\//.test(oembed.slide_image_baseurl) ? 'http:' : '') + oembed.slide_image_baseurl + '1' + oembed.slide_image_baseurl_suffix;

            utils.getImageMetadata(firstSlide, options, function(error, data) {

                if (error || data.error) {

                    console.log ('Error getting first slide for Slideshare: ' + error);

                } else if (data.width && data.height) {

                    links.push({
                        href: firstSlide,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.thumbnail,
                        width: data.width,
                        height: data.height
                    });
                }

                var $container = $('<div>');
                try {
                    $container.html(oembed.html);
                } catch(ex) {}

                var $iframe = $container.find('iframe');

                var aspect = (data.width && data.height) ? data.width / data.height : oembed.width / oembed.height;

                if ($iframe.length == 1) {
                    links.push({
                        href: $iframe.attr('src').replace('http:', ''),
                        type: CONFIG.T.text_html,
                        rel: [aspect > 1 ? CONFIG.R.player : CONFIG.R.reader, CONFIG.R.slideshow, CONFIG.R.html5],
                        "aspect-ratio": aspect,
                        "padding-bottom": 38
                    });
                }

                links.push ({
                    href: oembed.thumbnail,
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                    width: oembed.thumbnail_width,
                    height: data.height ? Math.round (oembed.thumbnail_width / (data.width / data.height)) : oembed.thumbnail_height
                });

                cb(null, links);

            });
        } else {
            cb (null, null);
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
        page: "http://www.slideshare.net/popular/today",
        selector: "a.iso_slideshow_link"
    }, {skipMethods: ["getData"]},
        "http://www.slideshare.net/geniusworks/gamechangers-the-next-generation-of-business-innovation-by-peter-fisk#btnNext",
        "https://www.slideshare.net/EnjoyDigitAll/le-design-thinking-by-enjoydigitall-71136562"
    ]
};