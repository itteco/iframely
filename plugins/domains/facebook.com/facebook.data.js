module.exports = {

    // It's official: https://developers.facebook.com/docs/plugins/oembed-endpoints

    mixins: [
        "domain-favicon",
        "oembed-author",
        "oembed-canonical",
        "oembed-site"
    ],

    getMeta: function(oembed) {

        if (oembed.html) {

            var description = oembed.html.match(/<p>(.*?)<\/p>/i);
            description = description ? description[1]: '';

            var title = oembed.html.match(/>([^<>]+)<\/a><p>/i);
            title = title ? title [1] : oembed.author_name;

            return {
                title: title,
                description: description 
            };
        }
    },

    tests: [{
        noFeeds: true
    }]
};