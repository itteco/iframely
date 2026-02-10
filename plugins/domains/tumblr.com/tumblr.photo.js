import * as cheerio from 'cheerio';

export default {

    re: 'tumblr.api',

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
            title = cheerio.load(title).text();
            if (title && title.length > 160) {
                title = title.split(/[.,!?]/)[0];
            }

            addImage(title, photo.original_size, CONFIG.R.image);
            var originalWidth = photo.original_size.width;

            var image = photo.alt_sizes?.find(function(image) {
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

    tests: [
        "https://fewthistle.tumblr.com/post/58045916432",
        "https://lincolnmotorco.tumblr.com/post/159272549438/the-1961-continental-convertible-photographed-at",
        "https://the-wolf-and-moon.tumblr.com/post/622353448279621632/ngc-2170-angel-nebula"
    ]
};
