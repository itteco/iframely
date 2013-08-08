module.exports = {

    re: /^http:\/\/([a-z0-9-]+\.tumblr\.com)\/post\/(\d+)(?:\/[a-z0-9-]+)?/i,

    getMeta: function(tumblr_post) {
        return {
            //title: tumblr_post.caption
        };
    },

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