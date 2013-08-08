module.exports = {

    getLinks: function(tumblr_post) {

        if (tumblr_post.type !== "photo") {
            return;
        }

        var links = [];
        tumblr_post.photos.forEach(function(photo) {
            var title = photo.caption;
            photo.alt_sizes.forEach(function(image, idx) {
                links.push({
                    title: title,
                    href: image.url,
                    type: CONFIG.T.image_jpeg,
                    rel: idx == 0 ? CONFIG.R.image : CONFIG.R.thumbnail,
                    width: image.width,
                    height: image.height
                });
            });
        });

        return links;
    }
};