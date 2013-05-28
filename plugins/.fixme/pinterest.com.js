var jquery = require('jquery');

module.exports = {

    // TODO: pinterest profile.
    // TODO: title.

    re: /^https?:\/\/pinterest\.com\/((?!pin)[a-z0-9]+)\/([\w\-]+)\/?(?:$|\?|#)/i,

    getData: function($selector) {

        var images = [];

        $selector('.pin').each(function(ix,el){

            var $el = jquery(el);

            var image = {
                src: $el.attr('data-closeup-url'),
                width: $el.attr('data-width'),
                height: $el.attr('data-height')
            };

            // TODO: calculate title, href and descriptions.

            images.push(image);
        });

        return {
            images: images
        };
    },

    tests: [{
        page: "http://pinterest.com/cssrabbit/",
        selector: "#ColumnContainer a"
    },
        "http://pinterest.com/bcij/pins/"
    ]
};