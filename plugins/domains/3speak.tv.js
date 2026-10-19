export default {

    re: [
        // Videos and shorts: author is a Hive account name, permlink is the post slug
        /^https?:\/\/(?:www\.)?3speak\.tv\/(watch|shorts)\?v=([a-z][a-z0-9.-]{1,14}[a-z0-9])\/([a-z0-9-]+)(?:[&#]|$)/
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "https://play.3speak.tv/watch?v=" + urlMatch[2] + "/" + urlMatch[3] + "&mode=iframe",
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": urlMatch[1] === "shorts" ? 9 / 16 : 16 / 9
            };
    },

    tests: [{
        noFeeds: true
    },
        "https://3speak.tv/watch?v=seckorama/sumski-vinodol",
        "https://3speak.tv/watch?v=meno/1czchhmr",
        "https://3speak.tv/shorts?v=bossdebz/fgdfx1ao"
    ]
};
