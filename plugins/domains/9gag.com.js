module.exports = {

    re: [
        /^https?:\/\/9gag\.com\/gag\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "favicon",
        "og-description",
        "og-site",
        "og-title",
        "canonical"
    ],

    getLink: function(cheerio) {
        var image;

        // Used for gifs.
        var $raw_image = cheerio('[data-image]');
        if ($raw_image.length) {
            image = $raw_image.attr('data-image');

        } else {

            // Used for large images.
            $raw_image = cheerio('[data-img]');
            if ($raw_image.length) {
                image = $raw_image.attr('data-img');
            }
        }

        if (image) {
            return {
                href: image,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            };
        }
    },
    
    tests: [ {
        page: "http://9gag.com",
        selector: ".badge-item-title a.badge-track"
    },
        "http://9gag.com/gag/5500821"
    ]
};
