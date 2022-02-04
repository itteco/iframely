import * as _ from 'underscore';
import cheerio from 'cheerio';


import tumblr_api from './tumblr.api.js';

export default {

    re: tumblr_api.re,

    getLinks: function(tumblr_post) {

        if (tumblr_post.type !== "photo") {
            return;
        }

        var links = [];

        function addImage(title, image, rel) {
            links.push({
                title: title,
                href: image.url.replace(/^https?:/, ''),
                type: CONFIG.T.image,
                rel: rel,
                width: image.width,
                height: image.height
            });
        }

        tumblr_post.photos.forEach(function(photo) {

            var title = photo.caption || tumblr_post.caption;
            title = cheerio('<div>').html(title).text();
            if (title && title.length > 160) {
                title = title.split(/[.,!?]/)[0];
            }

            addImage(title, photo.original_size, CONFIG.R.image);
            var originalWidth = photo.original_size.width;

            var image = _.find(photo.alt_sizes, function(image) {
                if (image.width <= originalWidth * 0.75 && image.width <= 400) {
                    return true;
                }
            });
            if (image) {
                addImage(title, image, CONFIG.R.thumbnail);
            }
        });

        return links;
    },

    tests: [{
        pageWithFeed: "http://lincolnmotorco.tumblr.com/"
    },
        "http://fewthistle.tumblr.com/post/58045916432"
    ]
};