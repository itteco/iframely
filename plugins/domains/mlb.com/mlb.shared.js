module.exports = {

    re: [
        /^https?:\/\/m\.mlb\.com\/shared\/video\/embed\/embed\.html\?content_id=(\d+)&?(?:&amp;)?topic_id=(\d+)/
        
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "http://m.mlb.com/video/?content_id=" + urlMatch[1] + "&topic_id=" + urlMatch[2]            
        });
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getLink"]
    },
        "http://m.mlb.com/shared/video/embed/embed.html?content_id=721945083&topic_id=6479266&width=400&height=224&property=mlb"
    ]
};