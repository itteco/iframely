var URL = require("url");

module.exports = {

    re: [        
        /^https?:\/\/m\.facebook\.com\/story\.php/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i,
        /^https?:\/\/(m|\w{2}\-\w{2})\.facebook\.com/i,
        /^https?:\/\/(?:touch\.|www\.)?facebook\.com\/l\.php\?u=/i,
        /^https?:\/\/www\.facebook\.com\/plugins\/(?:video|post)\.php\?href=/i,
        /^https?:\/\/www\.facebook\.com\/plugins\/comment_embed\.php\?href=/i         
    ],

    private: true, // do not show up in iframe.ly/domains.json

    getData: function(url, meta, cb) {

        // Little hack for FB mobile URLs, as FB embeds don't recognize it's own mobile links.
        if (url.indexOf("m.facebook.com/story.php") > -1) {
            return cb({redirect: url.replace("m.facebook.com/story.php", "www.facebook.com/permalink.php")});
        } else if (/^https?:\/\/(m|\w{2}\-\w{2})\.facebook\.com/i.test(url)) {
            return cb({redirect: url.replace(/(m|\w{2}\-\w{2})\.facebook\.com/i, "www.facebook.com")});
        }

        if (url.indexOf('facebook.com/l.php?u=') > -1 || /facebook\.com\/plugins\/(?:video|post|comment_embed)\.php\?href=/i.test(url)) {
            var uri = URL.parse(url,true);
            var query = uri.query;

            // https://www.facebook.com/l.php?u=https://www.youtube.com/watch?v=OpONaotsgow
            // https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcfgflint%2Fvideos%2Fvb.170211653052916%2F1080088265398579%2F%3Ftype%3D3&show_text=0&width=560
            // https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FWhiteMooseCafe%2Fposts%2F1789080394705902
            // https://www.facebook.com/plugins/comment_embed.php?href=https%3A%2F%2Fwww.facebook.com%2FNowThisPolitics%2Fvideos%2F1544622832235868%2F%3Fcomment_id%3D1544625588902259
            return cb({redirect: decodeURIComponent(query.u || query.href)});
        }

        if (meta["html-title"] === "Facebook" || meta["html-title"] === "Leaving Facebook...") {
            // the content is not public
            return cb({
                responseStatusCode: 403,
                message: "The content isn't shared publicly or requires a login."
            });
        }

        if (/^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i.test(url)) {
            // redirect to login
            return cb({
                responseStatusCode: 403,
                message: "The content isn't shared publicly and requires special permission."
            });
        }

        
        if (meta["html-title"] === "Content Not Found") {
            // for mobiles pages like https://m.facebook.com/story.php?story_fbid=654911224606798 fb doesn't return 404
            return cb({responseStatusCode: 404});
        }        

        cb(null);
    },

    tests: [{
        noFeeds: true
    }]
};