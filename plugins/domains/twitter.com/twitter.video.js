module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_video'],

    getData: function(__allow_twitter_video, og) {

        return {
            twitter_video: (og.video && og.image && /^https?:\/\/pbs\.twimg\.com\//i.test(og.image.url || og.image.src || og.image)) ? og.video : false
            // exclude proxy images, ex:
            // https://twitter.com/nfl/status/648185526034395137
        }
    }
};