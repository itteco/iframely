module.exports = {

    mixins: [
        "*"
    ],

    getData: function(twitter) {
        
        if (twitter.player && twitter.player.value) {

            return {
                video_src: twitter.player.value
            };
        }
    },
    

    tests: [{
        pageWithFeed: 'http://boyt.podbean.com'
    }, {
        pageWithFeed: 'http://anfieldindex.podbean.com'
    },
        "https://www.podbean.com/media/share/pb-4b3p9-6c1e03#.WUmvykLHCNg.twitter"
    ]
};