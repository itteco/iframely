module.exports = {

	re: [
		/^https?:\/\/(?:www\.)?wat\.tv\/embedframe\/([a-zA-Z0-9_\-]+)/i
	],

    provides: "watID",

    mixins: [
        "*"
    ],

    getLink: function(watID) {                
        return {
            href: '//www.wat.tv/embedframe/' + watID,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 16/9
        }
    },

    getData: function(urlMatch) {
        return {
            watID: urlMatch[1]
        }
    },    

    tests: [
        "http://www.wat.tv/embedframe/116870chuPP3r13256108",

    ]
};