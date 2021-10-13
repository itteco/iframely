export default {

    re: [
        /https?:\/\/i\.giphy\.com\/(\w+)\.gif(\?.*)?$/i,
        /https?:\/\/media\d?\.giphy\.com\/media\/(\w+)\/([^\.\?]+)?\.(?:gif|mp4|webm|mov)(\?.*)?$/i,        
        /https?:\/\/giphy\.com\/gifs\/(\w+)\/html5(\?.*)?$/i,
        /https?:\/\/giphy\.com\/embed\/(\w+)/i
    ],

    getData: function(urlMatch, cb) {
        cb ({
            redirect: "https://giphy.com/gifs/" + urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getData"]
    },
        "http://i.giphy.com/10rNBP8yt1LUnm.gif",
        "https://media.giphy.com/media/3o6Zt09XtyqOJWVgRO/source.gif",
        "https://media3.giphy.com/media/puOukoEvH4uAw/giphy.gif?cid=4bf119fc5b9ed43565707a736f134885",
        "https://media.giphy.com/media/2tSodgDfwCjIMCBY8h/200w_d.gif",
        "https://media.giphy.com/media/VJYyszxCpXLtc23AjZ/source.mov",
        "https://media.giphy.com/media/3b9GWF0yLrsVj7vd9i/giphy-downsized.gif",
        "https://media.giphy.com/media/fUBDoSXi5rB5t2INOq/giphy-downsized-large.gif"
    ]
};