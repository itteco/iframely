module.exports = {

    re: [
        /^https?:\/\/(?:listen\.)?tidal\.com\/(album|track|playlist)/i
        // `video` is broken
    ],

    mixins: ["*"],

    getLink: function(twitter) {
        return {
            href: twitter.player && twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.twitter], // `player` doesn't really play
            width: twitter.player.width,
            height: twitter.player.height
        };
    },

    getData: function (url, cb)  {

        if (/^https?:\/\/listen\.tidal\.com\/(album|track|playlist)/i.test(url)) {

            return cb ({
                redirect: url.replace(/^https?:\/\/listen\./i, 'http://')
            }); 
        } else { return cb (null, {});}
    },

    tests: [
        "http://tidal.com/track/56638583"
    ]
};