module.exports = {

    re: [
        /^https?:\/\/www\.metacafe\.com\/watch\/yt\-([\-_a-zA-Z0-9]+)\//i
    ],

    //for example, www.metacafe.com/watch/yt-4N3N1MlvVc4/mad_world_gary_jules/

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "https://www.youtube.com/watch?v=" + urlMatch[1]
        });
    }

};