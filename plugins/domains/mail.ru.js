module.exports = {

    re: [
        /^https?:\/\/my\.mail\.ru\/(inbox|mail|list|bk|corp)\/[a-zA-Z0-9\._\-]+\/video\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+)\.html/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, url) {

        if (og.type !== 'video.other') {
            return;
        }

        return {
                href: '//videoapi.my.mail.ru/videos/embed/' + url.replace(/^https?:\/\/my\.mail\.ru\//, ''),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": 626 / 367
            };
    },

    tests: [
        "http://my.mail.ru/mail/ee.vlz/video/22396/44907.html",
        "http://my.mail.ru/mail/stryukova_lv/video/6177/1029.html",
        "http://my.mail.ru/mail/shiniavskii/video/_myvideo/4.html",
        "https://my.mail.ru/inbox/wwf00/video/11/46.html"
    ]
};