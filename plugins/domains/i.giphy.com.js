module.exports = {

    re: [
        /https?:\/\/i\.giphy\.com\/(\w+)\.gif(\?.*)?$/i,
        /https?:\/\/media\d?\.giphy\.com\/media\/(\w+)\/(?:giphy|source|\d+)(?:_\w)?\.gif$/i,        
        /https?:\/\/giphy\.com\/gifs\/(\w+)\/html5$/i,
        /https?:\/\/giphy\.com\/embed\/(\w+)/i        
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
        "http://i.giphy.com/10rNBP8yt1LUnm.gif",
        "http://giphy.com/gifs/FC8MlptXIrCWk/html5",
        "https://media.giphy.com/media/3o6Zt09XtyqOJWVgRO/source.gif"
    ]
};