module.exports = {

    getData: function(url, video_src, twitter) {

        var stream = twitter.player && twitter.player.stream && twitter.player.stream.value;
        
        if (stream
            && /\/preview\/([a-zA-Z0-9\-]+)\//i.test(stream)
            && /^https?:\/\/html5\-player\.libsyn\.com\/embed(\/episode\/id\/\d+)/i.test(video_src)
            && /^https?:\/\/[a-z0-9\.\-]+\//i.test(url)) {

            return {
                __promoUri: {                    
                    url: 'http://' + stream.match(/\/preview\/([a-zA-Z0-9\-]+)\//i)[1] 
                        + '.libsyn.com/'
                        + url.replace(/^https?:\/\/[a-z0-9\.\-]+\//i, ''),
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };

        } 
    }

    // http://trendfollowingradio.com/episode-1-the-trend-following-manifesto-with-michael-covel
    // http://coloristpodcast.com/episode-005-terence-curren
    // http://whos-he-podcast.co.uk/whos-he-podcast-274
    // http://heartfeldt.spinninpodcasts.com/heartfeldt-radio-76
    // http://podcast.wh1t3rabbit.net/dtsr-episode-254-lowdown-and-dirty-ics

};