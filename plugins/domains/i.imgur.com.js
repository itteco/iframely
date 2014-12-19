module.exports = {

    re: /https?:\/\/i\.imgur\.com\/(\w+)\.(jpg|gif|png|gifv)$/i,

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "http://imgur.com/" + urlMatch[1]
        });
    },

    tests: [
        "https://i.imgur.com/F5iTjVS.jpg",
        "http://i.imgur.com/mtfSGqo.gifv"
    ]
};