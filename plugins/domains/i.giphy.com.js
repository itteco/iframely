module.exports = {

    re: [
    	/https?:\/\/i\.giphy\.com\/(\w+)\.gif(\?.*)?$/i,
    	/https?:\/\/media\d?\.giphy\.com\/media\/(\w+)\/giphy\.gif$/i        
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "http://giphy.com/gifs/" + urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getLink"]
    },
        "http://media.giphy.com/media/m4r4RTpCzkh0I/giphy.gif",
    	"http://i.giphy.com/10rNBP8yt1LUnm.gif"
    ]
};