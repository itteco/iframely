var _ = require('underscore');

module.exports = {

    getLinks: function(tumblr_post) {

        if (tumblr_post.type !== "photo") {
            return;
        }

        var links = [];

        function addImage(title, image, rel) {
            links.push({
                title: title,
                href: image.url,
                type: CONFIG.T.image,
                rel: rel,
                width: image.width,
                height: image.height
            });
        }

        tumblr_post.photos.forEach(function(photo) {

            var title = photo.caption;

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
        pageWithFeed: "http://bows-and-polkadots.tumblr.com/"
    },
        "http://fewthistle.tumblr.com/post/58045916432"
    ]
};