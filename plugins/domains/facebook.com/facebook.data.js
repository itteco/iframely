var entities = require('entities');

module.exports = {

    // It's official: https://developers.facebook.com/docs/plugins/oembed-endpoints

    mixins: [
        "domain-icon",
        "oembed-author",
        "oembed-canonical",
        "oembed-site",
        "oembed-error"
    ],

    getMeta: function(oembed) {

        if (oembed.html) {

            var description = oembed.html.match(/<p>([^<>]+)<\/p>/i);
            description = description ? description[1]: '';

            var author = oembed.html.match(/Posted by <a(?:[^<>]+)>([^<>]+)<\/a>/);
            author = author ? author[1]: oembed.author_name;

            var title = oembed.html.match(/>([^<>]+)<\/a><p>/i);
            title = title ? title[1] : author;

            return {
                title: entities.decodeHTML(title),
                description: entities.decodeHTML(description),
                author: author
            };
        }
    },

    tests: [{
        noFeeds: true
    }]
};