export default {

    re: [        
        /https?:\/\/(?:www\.)?vbox7\.com\/play:(\w+)/i
    ],

    mixins: ["*"],

    getLinks: function(urlMatch) {

        return {
            href: "https://vbox7.com/emb/external.php?vid=" + urlMatch[1],
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16 / 9
        }
    },

    tests: [
        "https://vbox7.com/play:dacbe546dd",
        "https://www.vbox7.com/play:bc53a41285",
        "https://www.vbox7.com/play:3008fee68a"
    ]
};