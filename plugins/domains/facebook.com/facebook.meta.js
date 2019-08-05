const entities = require('entities');

module.exports = {

    // It's official: https://developers.facebook.com/docs/plugins/oembed-endpoints

    re: [].concat(require('./facebook.post').re, require('./facebook.video').re),

    mixins: [
        "domain-icon",
        "oembed-author",
        "oembed-canonical",
        "oembed-site"
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
                title: title ? entities.decodeHTML(title) : null,
                description: description ? entities.decodeHTML(description) : null,
                author: author
            };
        }
    },

    tests: [{
        noFeeds: true
    }]
};