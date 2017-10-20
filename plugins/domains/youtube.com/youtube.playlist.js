module.exports = {

    re: [
        /^https?:\/\/www\.youtube\.com\/playlist\?list=([\-_a-zA-Z0-9]+)/i        
    ],

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "oembed-video",
        "domain-icon"
    ],    

    tests: [{
        noFeeds: true
    },
        "https://www.youtube.com/playlist?list=PLWYwsGgIRwA9y49l1bwvcAF0Dj-Ac-5kh"
    ]
};
