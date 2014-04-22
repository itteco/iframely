module.exports = {

    re: [
        /^https?:\/\/my\.mail\.ru\/video\//i
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
        "http://my.mail.ru/video/inbox/oleg.kondakov/3/3166.html#video=/inbox/oleg.kondakov/3/3166",
        "http://my.mail.ru/video/mail/ee.vlz/22396/44907.html#video=/mail/ee.vlz/22396/44907"
    ]
};