module.exports = {

    re: [
        /^https?:\/\/www\.metacafe\.com\/watch\/yt\-([\-_a-zA-Z0-9]+)\//i
    ],

    mixins: ["*"],

    //for example, www.metacafe.com/watch/yt-4N3N1MlvVc4/mad_world_gary_jules/

    getData: function(urlMatch) {

        return {
            __promoUri: {
                url: "https://www.youtube.com/watch?v=" + urlMatch[1],
                rel: 'player'
            }
        };
    }

};