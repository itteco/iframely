module.exports = {

    mixins: [
        "twitter-image",
        "twitter-player-responsive"
    ],

    getData: function(meta) {
        return {
            title: meta.twitter.description
        }
    },

    tests: ["https://vine.co/v/bjHh0zHdgZT"]
};