module.exports = {

    re: [
        /^https?:\/\/my\.mail\.ru\/(inbox|mail)\/[a-zA-Z0-9\._\-]+\/video\/(\d+)\/(\d+)\.html/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(og, urlMatch) {
                                                            // No id in canonical means - 404
        if (!og.type || !/video/i.test(og.type) || !og.url || og.url.indexOf(urlMatch[3]) === -1) {
            return;
        }

        if (!urlMatch) {
            return;
        }

        return {
                href: "//videoapi.my.mail.ru/videos/embed/" + og.url.match(/video\/([a-zA-Z0-9\.\-\/]+)/)[1],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 626 / 367
            };
    },

    tests: [
        "http://my.mail.ru/mail/ee.vlz/video/22396/44907.html",
        "http://my.mail.ru/mail/stryukova_lv/video/6177/1029.html"
    ]
};