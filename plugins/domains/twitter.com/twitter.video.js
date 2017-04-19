module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_og'],

    getData: function(__allow_twitter_og, og) {

        return {
            twitter_og: og
            // exclude proxy images, ex:
            // https://twitter.com/nfl/status/648185526034395137
        }
    }
};