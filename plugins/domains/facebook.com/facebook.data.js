var DEFAULT_WIDTH = 466;

module.exports = {

    provides: 'facebook_post',

    mixins: [
        "favicon"
    ],

    getMeta: function(facebook_post) {
        return {
            title: facebook_post.title,
            site: "Facebook"
        };
    },

    getData: function(url, meta, cb) {

        if (meta["html-title"] === "Facebook") {
            // the content is not public
            return cb({responseStatusCode: 403});
        }

        var title = meta["description"] ? meta["description"]: meta["html-title"].replace(/ \| Facebook$/, "");

        // Little hack for FB mobile URLs, as FB embeds don't recognize it's own mobile links.
        var redirect;
        if (url.indexOf("m.facebook.com/story.php") > -1) {
            redirect = url.replace("m.facebook.com/story.php", "www.facebook.com/permalink.php");
        }

        cb(null, {
            facebook_post: {
                title: title,
                url: redirect || url
            }
        });
    },

    tests: [{
        noFeeds: true
    }]
};