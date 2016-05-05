module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_video'],

    getData: function(__allow_twitter_video, og) {

        return {
            twitter_video: og.video || false
        }
    }
};