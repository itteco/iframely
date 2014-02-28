module.exports = {

    re: [
        /^http:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^http:\/\/([a-z-\.]+)\/(post|post)\/(\d{11})(?:\/[a-z0-9-]+)?/i
    ],

    getData: function(tumblr_post) {

        if (tumblr_post.type !== "text") {
            return;
        }

        return {
            safe_html: tumblr_post.body
        };
    },

    tests: [
        "http://tiffany-anc.tumblr.com/post/58056730720/truth-what-filthy-thought-are-you-thinking-right-now",
        "http://starsshinetoobrightly.tumblr.com/post/58055596742/17",
        "http://asimpleweirdlass.tumblr.com/post/58054585454/nakakatakot-kanina-ang-dilim-sa-street-tapos"
    ]
};