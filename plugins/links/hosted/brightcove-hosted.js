module.exports = {

    provides: '__promoUri',

    getData: function(video_src, meta) {

        // do not process brightcove's custom domains - it's covered by record through oembed endpoint
        if (/^brightcove$/i.test(meta.generator)) {return;}
        
        var urlMatch = video_src.match(/^https?:\/\/link\.brightcove\.(?:com|co\.jp)\/services\/player\/bcpid(\d+)\/?\?/i);

        if (urlMatch) {
            return {
                __promoUri: video_src
            };
        }

        urlMatch = video_src.match(/^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-_]+|default)_default\/index.html\?videoId=([a-zA-Z0-9\-:]+)/i) ||
                   video_src.match(/^https?:\/\/bcove\.me\/[a-zA-Z0-9]+/i);

        if (urlMatch) {
            return {
                __promoUri: video_src
            };
        }


        if (/^https?:\/\/(?:c|secure)\.brightcove\.(?:com|co\.jp)\/services\/viewer\/federated_f9\/?/i.test(video_src)) {            
            var playerID = video_src.match(/playerID=([^&]+)/i);
            if (!playerID) {
                playerID = video_src.match(/federated_f9\/(\d+)\?/i);
            }

            var videoID = video_src.match(/video(?:ID|Player)?=([^&]+)/i); // some have `Id` for some reason

            if (playerID && videoID) {

                return {
                    __promoUri: "http://link.brightcove." + (/\.co\.jp/.test(video_src) ? 'co.jp' : 'com')+ "/services/player/bcpid" + playerID[1] + "?bctid=" + videoID[1]
                };
            }

        }
    }

    /* Sample URLs for hosted Brightcove video galleries
        http://video.massachusetts.edu/detail/videos/here-for-a-reason/video/4767578288001/transform?autoStart=true
        http://oncologyvu.brightcovegallery.com/detail/videos/treatment-methods/video/3880531728001/importance-of-the-nurse-patient-relationship?autoStart=true
        http://video.brightcovelearning.com/detail/videos/managing-players/video/4805928382001/styling-players?autoStart=true
    */

};