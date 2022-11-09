export default {

    getData: function(url, video_src, twitter) {

        var stream = twitter.player && twitter.player.stream && twitter.player.stream.value;

        if (stream
            && /traffic\.libsyn.com\/(?:preview|secure)\/([a-zA-Z0-9\-]+)\//i.test(stream)
            && /^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/(\d+)/i.test(video_src)
            && /^https?:\/\/[a-z0-9\.\-]+\//i.test(url)) {

            var id = video_src.match(/^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/(\d+)/i)[1];

            return {
                __promoUri: {                    
                    url: `https://play.libsyn.com/embed/episode/id/${id}/`,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };

        } 
    },

    tests: [
        "http://trendfollowingradio.com/episode-1-the-trend-following-manifesto-with-michael-covel",
        "http://coloristpodcast.com/episode-005-terence-curren", // No oembed autodiscovery on canonical
        "http://whos-he-podcast.co.uk/whos-he-podcast-274",
        "http://heartfeldt.spinninpodcasts.com/heartfeldt-radio-76", // No oembed autodiscovery on canonical
        "http://podcast.wh1t3rabbit.net/dtsr-episode-254-lowdown-and-dirty-ics"
    ]
};