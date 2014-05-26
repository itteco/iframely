module.exports = {

    re: [
        /^https?:\/\/my\.mail\.ru\/(inbox|mail)\/[a-zA-Z0-9\.\-]+\/video\//i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(og) {

        if (!og.type || !/video/i.test(og.type) || !og.url) return;

        return {
                href: "http://api.video.mail.ru/videos/embed/" + og.url.match(/video\/([a-zA-Z0-9\.\-\/]+)/)[1],
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 626 / 367
            };
    },

    tests: [
        "http://my.mail.ru/inbox/oleg.kondakov/video/3/1128.html",
        "http://my.mail.ru/mail/ee.vlz/video/22396/44907.html"
    ]
};