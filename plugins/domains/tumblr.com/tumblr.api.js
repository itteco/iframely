import * as cheerio from 'cheerio';


export default {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post)\/(\d{11,14})(?:\/[a-z0-9-]+)?(?:\?.*)?(?:#.*)?$/i
    ],

    provides: 'tumblr_post',

    getMeta: function(tumblr_post) {

        // TODO: fix using cheerio
        var caption = tumblr_post.caption ? cheerio('<div>').html(tumblr_post.caption).text() : "";
        if (caption && caption.length > 160) {
            caption = caption.split(/[.,!?]/)[0];
        }

        return {
            title: tumblr_post.title || caption || tumblr_post.summary || tumblr_post.blog_name,
            site: 'Tumblr',
            author: tumblr_post.blog_name,
            author_url: 'https://' + tumblr_post.blog_name + '.tumblr.com',
            canonical: tumblr_post.permalink_url || tumblr_post.post_url,
            tags: tumblr_post.tags && tumblr_post.tags.join(', '),
            shortlink: tumblr_post.short_url,
            date: tumblr_post.date,
            duration: tumblr_post.duration,
            // TODO: fix using cheerio
            description: tumblr_post.body && /<p/.test(tumblr_post.body) ? cheerio('<div>').html(tumblr_post.body).find('p').first().text() : null
        };
    },

    getLink: function(tumblr_post) {

        var icon = {
            href: "https://assets.tumblr.com/images/apple-touch-icon-196x196.png",
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

    getData: function(oembedLinks, urlMatch, request, options, cb) {

        // oEmbed will be in the known providers for *.tumblr.com; and it requires HTML parser discovery for custom domains.
        var oembedLink = oembedLinks['0'];

        if (!(oembedLink && /^https?:\/\/(?:www\.)?tumblr\.com/.test(oembedLink.href))) {
            return cb(null); // Not a Tumblr domain, skip API calls and fall back to generic.
        }

        var consumer_key = options.getProviderOptions('tumblr.consumer_key');

        if (!consumer_key) {
            cb (new Error ("No tumblr.consumer_key configured"));
            return;
        }

        request({
            uri: "https://api.tumblr.com/v2/blog/" + urlMatch[1] + "/posts",
            qs: {
                api_key: consumer_key,
                id: urlMatch[3]
            },
            json: true,
            prepareResult: function (error, response, body, cb) {

                if (error || body.errors) {
                    return cb(error || body.errors || 'There was a Tumblr API error');
                }

                if (!body.meta) {
                    return cb({responseStatusCode: 415, message: 'This Tumblr may contain sensitive media and is not supported'});
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
            }
        }, cb);
    }
};
