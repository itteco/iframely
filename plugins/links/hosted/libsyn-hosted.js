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
        "https://whos-he-podcast.co.uk/whos-he-at-the-movies-halloween-week-an-american-werewolf-in-london",
        "https://whos-he-podcast.co.uk/whos-he-podcast-274",

        // no twitter player "https://www.trendfollowing.com/2026/11/08/ep-1415-the-great-bend-over-with-michael-covel-on-trend-following-radio/",
    ]
};