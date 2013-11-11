module.exports = {


    re: [
        /^http:\/\/(\w+\.)?lifehacker\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?gawker\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?jezebel\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?gizmodo\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?deadspin\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?io9\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?kotaku\.com\/[a-z0-9-]+/i,
        /^http:\/\/(\w+\.)?jalopnik\.com\/[a-z0-9-]+/i
    ],


    mixins: [
        "twitter-image",
        "favicon",
        "twitter-author",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    getData: function(meta, $selector) {

        var $html = $selector('div.post-content');

        if ($html.length) {

            var $image = $selector('span.img-border.mbs img');
            var $iframe = $selector('span.flex-video iframe');

            var html = '';

            if ($image.length) {
                html = $image.parent().html();
            } else if ($iframe.length) {
                html = $iframe.parent().html();
            }

            html += $html.html();

            return {
                readability_data: {
                    html: html
                }
            };
        }

    },    

    tests: [
        "http://lifehacker.com/iframely-for-gmail-adds-inline-previews-to-links-in-gma-1441190492"
    ]
};