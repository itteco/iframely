var $ = require('jquery');
var _ = require('underscore');

module.exports = {

    re: /^http:\/\/([a-z0-9-]+\.tumblr\.com)\/post\/(\d+)(?:\/[a-z0-9-]+)?/i,

    getMeta: function(tumblr_post) {
        return {
            title: $('<div>').html(tumblr_post.caption).text(),
            site: 'tumblr',
            author: tumblr_post.blog_name,
            author_url: 'http://' + tumblr_post.blog_name + '.tumblr.com',
            canonical: tumblr_post.post_url,
            tags: _.unique([].concat(tumblr_post.tags, tumblr_post.featured_in_tag || [])).join(', '),
            shortlink: tumblr_post.short_url,
            date: tumblr_post.timestamp * 1000
        };
    },

    mixins: [
        "favicon"
    ],

    getData: function(urlMatch, request, cb) {

        request({
            uri: "http://api.tumblr.com/v2/blog/" + urlMatch[1] + "/posts",
            qs: {
                api_key: CONFIG.providerOptions.tumblr.consumer_key,
                id: urlMatch[2]
            },
            json: true
        }, function (error, response, body) {

            if (error) {
                return cb(error);
            }

            if (body.meta.status != 200) {
                return cb(body.meta.msg);
            }

            var posts = body.response.posts;
            if (posts.length > 0) {
                cb(null, {
                    tumblr_post: posts[0]
                });
            } else {
                cb(null);
            }
        });
    },

    tests: [
    ]
};