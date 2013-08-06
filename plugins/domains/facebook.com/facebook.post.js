module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/.+/i,

    getLink: function(url, meta) {

        var title = meta["html-title"];
        title = title.replace(/ \| Facebook$/, "");

        return {
            title: title,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template_context: {
                title: title,
                url: url
            },
            width: 552,
            height: 586
        }
    },

    tests: [
        "https://www.facebook.com/noven.roman/posts/555607674475258",
        "https://www.facebook.com/logvynenko/posts/10151487164961783",
        "https://www.facebook.com/photo.php?fbid=530060777048531&set=a.215094428545169.62692.100001338405848&type=1",
        {
            noFeeds: true
        }
    ]
};