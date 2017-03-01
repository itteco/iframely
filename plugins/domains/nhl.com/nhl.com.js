module.exports = {

    re: [
        /https?:\/\/(?:www\.)?nhl\.com(\/\w+\/)video\/(?:embed\/)?([a-zA-Z0-9\-]+\/t\-\d+\/c\-\d+)/i,
        /https?:\/\/(?:www\.)?nhl\.com(\/)video\/(?:embed\/)?([a-zA-Z0-9\-]+\/t\-\d+\/c\-\d+)/i,
        /https?:\/\/(?:www\.)?nhl\.com\/video\/([a-zA-Z0-9\-]+\/c\-\d+)/i
    ],

    mixins: ["*"],

    getLinks: function(urlMatch, url, meta, options, cb) {

        if (urlMatch.length < 3) {

            if (meta.canonical && url !== meta.canonical && (!options.redirectsHistory || options.redirectsHistory.indexOf(meta.canonical) === -1)) {

                return cb ({
                    redirect: meta.canonical
                });
            } else {
                return cb (null, null);
            }

        } else {

            return cb (null, {
                href: "https://www.nhl.com" + urlMatch[1] + "video/embed/" + urlMatch[2] + "?autostart=false",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": 540 / 310,
                autoplay: 'autostart=true'
            });
        }
    },

    tests: [
        "https://www.nhl.com/video/whatsyourgoal-emilie/t-277443408/c-40739903",
        "https://www.nhl.com/video/toews-ot-winner/t-277350912/c-40861003",
        "https://www.nhl.com/video/niskanens-go-ahead-goal/t-277983160/c-40970503",
        "https://www.nhl.com/video/embed/abramov-interview-video/t-277521762/c-44299003",
        "https://www.nhl.com/ru/video/embed/abramov-interview-video/t-277521762/c-44299003"
    ]
};