module.exports = {

    // e.g. http://www.kinitv.com/video/3495O8
    getLink: function(twitter) {

        if (!twitter.player || !twitter.player.value) return;
        
        var video_src = twitter.player.value || twitter.player;

        var urlMatch = video_src.match(/^https?:\/\/www\.youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/youtube\.googleapis\.com\/v\/([\-_a-zA-Z0-9]+)/i) //youtube.googleapis.com/v/k3Cd2lvQlN4?rel=0
                    || video_src.match(/https?:\/\/www.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtu\.be\/([\-_a-zA-Z0-9]+)/i);


        if (urlMatch) {

            var params = (CONFIG.providerOptions.youtube && CONFIG.providerOptions.youtube.get_params) ? CONFIG.providerOptions.youtube.get_params : "";

            return {
                href: "https://youtube.com/embed/" + urlMatch[1] + params,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": (twitter.player.height && twitter.player.width) ? twitter.player.width / twitter.player.height : 4/3
            }

        }
    }
};