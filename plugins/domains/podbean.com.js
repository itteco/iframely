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
        "http://realenglishconversations.podbean.com/e/english-podcast-17-our-personal-story-real-english-conversations/"
    ]
};