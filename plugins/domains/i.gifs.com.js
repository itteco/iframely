module.exports = {

    re: [
    	/https?:\/\/j\.gifs\.com\/(\w+)\.gif$/i
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "https://gifs.com/gif/--" + urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getLink"]
    },
        "https://j.gifs.com/vM4o5O.gif"
    ]
};