module.exports = {

    provides: '__promoUri',

    getData: function(url, meta, whitelistRecord) {

        if (!whitelistRecord.isDefault && ((meta.og && meta.og.image) || (meta.twitter && meta.twitter.image))) {return;}

        if (/^https?:\/\/(link|players)\.brightcove\.(?:com|net|co\.jp)/i.test(url)) {return;}
        // do not process links to itself, otherwise -> infinite recursion
        
        if (!meta.twitter && !meta.og) {return;}
        
        var video_src = (meta.twitter && ((meta.twitter.player && meta.twitter.player.value) || meta.twitter.player));

        if ((!video_src || !/\.brightcove\.(?:com|net|co\.jp)\//i.test(video_src)) && meta.og) {

            var ogv = meta.og.video instanceof Array ? meta.og.video[0] : meta.og.video;
            video_src = ogv && (ogv.url || ogv.secure_url);

            if (/^\/\//i.test(video_src)) {
                video_src = "http:" + video_src;
            }
        }

        if (!video_src || !/\.brightcove\.(?:com|net|co\.jp)\//i.test(video_src)) {
            return;
        }
        

        var urlMatch = video_src.match(/^https?:\/\/link\.brightcove\.(?:com|co\.jp)\/services\/player\/bcpid(\d+)\/?\?/i)
                    || video_src.match(/^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-_]+|default)_default\/index.html\?videoId=([a-zA-Z0-9\-:]+)/i);


        if (urlMatch) {

            return {
                __promoUri: video_src
            };
        }

        if (/^https?:\/\/(?:c|secure)\.brightcove\.(?:com|co\.jp)\/services\/viewer\/federated_f9\/?/i.test(video_src)) {
            var playerID = video_src.match(/playerID=([^&]+)/i);
            var videoID = video_src.match(/videoID=([^&]+)/i); // some have `Id` for some reason

            if (playerID && videoID) {

                return {
                    __promoUri: "http://link.brightcove." + (/\.co\.jp/.test(video_src) ? 'co.jp' : 'com')+ "/services/player/bcpid" + playerID[1] + "?bctid=" + videoID[1]
                };
            }

        }
    }

    /* 
        http://tv.tokyo-gas.co.jp/watch/902548399002  - Japaneese
        http://www.glamour.ru/video/tvorozhnyy-tort/
    */

    // http://archive.jsonline.com/multimedia/video/?bctid=5047519850001&bctid=5047519850001 - new HTML 5 players
    // http://www.servustv.com/de/Medien/Frances-Ha - custom twitter, bug og brightcove
};