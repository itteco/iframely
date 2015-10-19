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

        if (meta["html-title"] === "Content Not Found") {
            // for mobiles pages like https://m.facebook.com/story.php?story_fbid=654911224606798 fb doesn't return 404
            return cb({responseStatusCode: 404});
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