module.exports = {

    re: /http:\/\/i\.imgur\.com\/(\w+)\.(jpg|gif|png)$/i,

    getMeta: function(urlMatch) {
        return {
            title: urlMatch[1] + "- Imgur",
            site: "Imgur"
        };
    },

    getLinks: function(url) {

        return [{
            href: url.replace("http:", ""),
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.thumbnail],
        }, {
            href: "//imgur.com/favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }];
    },    

    tests: [
        "https://i.imgur.com/F5iTjVS.jpg"
    ]
};