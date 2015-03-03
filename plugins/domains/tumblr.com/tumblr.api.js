var $ = require('cheerio');
var _ = require('underscore');

module.exports = {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post|post)\/(\d{11,13})(?:\/[a-z0-9-]+)?/i
    ],

    provides: 'tumblr_post',

    getMeta: function(tumblr_post) {

        var caption = tumblr_post.caption ? $('<div>').html(tumblr_post.caption).text() : "";
        if (caption && caption.length > 160) {
            caption = caption.split(/[.,!?]/)[0];
        }

        return {
            title: tumblr_post.title || caption || tumblr_post.blog_name,
            site: 'Tumblr',
            author: tumblr_post.blog_name,
            author_url: 'http://' + tumblr_post.blog_name + '.tumblr.com',
            canonical: tumblr_post.permalink_url || tumblr_post.post_url,
            tags: _.unique([].concat(tumblr_post.tags, tumblr_post.featured_in_tag || [])).join(', '),
            shortlink: tumblr_post.short_url,
            date: tumblr_post.timestamp * 1000,
            duration: tumblr_post.duration
        };
    },

    getLink: function(tumblr_post) {

        var icon = {
            href: "//secure.assets.tumblr.com/images/favicons/favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        };

        if (!tumblr_post.thumbnail_url) {
            return icon;
        }

        return [icon, {
            href: tumblr_post.thumbnail_url,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image,
            width: tumblr_post.thumbnail_width,
            height: tumblr_post.thumbnail_height
        }];
    },

    getData: function(urlMatch, request, cb) {

        if (!CONFIG.providerOptions.tumblr || !CONFIG.providerOptions.tumblr.consumer_key) {
            cb (new Error ("No tumblr.consumer_key configured"));
            return;
        }

        request({
            uri: "http://api.tumblr.com/v2/blog/" + urlMatch[1] + "/posts",
            qs: {
                api_key: CONFIG.providerOptions.tumblr.consumer_key,
                id: urlMatch[3]
            },
            json: true,
            limit: 1, 
            timeout: 1000
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
    }
};