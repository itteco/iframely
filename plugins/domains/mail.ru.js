export default {

    re: [
        /^https?:\/\/my\.mail\.ru\/\/?[a-z\.]+\/[a-zA-Z0-9\._\-]+\/video\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+)\.html/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, url) {

        if (og.type !== 'video.other' || !og.image) {
            return;
        }

        var thumbnail = og.image;
        var video_id = og.image.match(/\/url\/\w{3,6}\/(\d+)$/);

        if (video_id) {

            return {
                    href: "https://my.mail.ru/video/embed/" + video_id[1],
                    accept: CONFIG.T.text_html,
                    rel: CONFIG.R.player,
                    "aspect-ratio": 626 / 367,
                    autoplay: "autoplay=1"
                };
        }
    },

    getData: function(meta, cb) {
        return cb(!meta.og ? {responseStatusCode: 404} : null);
    },

    tests: [
        "https://my.mail.ru/mail/ee.vlz/video/22396/44907.html",
        "https://my.mail.ru/gmail.com/arisplafou73/video/_myvideo/3.html",
        "https://my.mail.ru/mail/stryukova_lv/video/6177/1029.html",
        "https://my.mail.ru/inbox/wwf00/video/11/46.html",
        {
            skipMethods: ['getData']
        }
    ]
};