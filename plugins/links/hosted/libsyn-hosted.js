export default {

    getData: function(url, video_src, twitter) {

        const stream = twitter.player && twitter.player.stream && twitter.player.stream.value;
        const video_src_re = /^https?:\/\/(?:html5\-player|play)\.libsyn\.com\/embed\/episode\/id\/(\d+)/i

        if (stream
            && /traffic\.libsyn.com\/(?:preview|secure)\/([a-zA-Z0-9\-]+)\//i.test(stream)
            && video_src_re.test(video_src)
            && /^https?:\/\/[a-z0-9\.\-]+\//i.test(url)) {

            const id = video_src.match(video_src_re)[1];

            return {
                __promoUri: {                    
                    url: `https://play.libsyn.com/embed/episode/id/${id}/`
                }
            };

        } 
    },

    tests: [
        "https://trendfollowingradio.com/episode-1-the-trend-following-manifesto-with-michael-covel",
        "https://whos-he-podcast.co.uk/whos-he-podcast-274"
    ]
};