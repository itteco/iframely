module.exports = {

    provides: '__promoUri',

    getData: function(url, meta, whitelistRecord) {

        if (!whitelistRecord.isDefault && ((meta.og && meta.og.image) || (meta.twitter && meta.twitter.image))) {return;}

        if (/^https?:\/\/(link|players)\.brightcove\.(?:com|net|co\.jp)/i.test(url)) {return;}
        // do not process links to itself, otherwise -> infinite recursion
        
        if (!meta.twitter && !meta.og) {return;}
        
        var video_src = (meta.twitter && ((meta.twitter.player && meta.twitter.player.value) || meta.twitter.player));

        if (!video_src && meta.og) {

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
                    || video_src.match(/^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-]+|default)_default\/index.html\?videoId=([a-zA-Z0-9\-:]+)/i);


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
        http://www.guampdn.com/videos/news/nation/2015/08/18/31948487/        
        http://www.airforcetimes.com/videos/military/2015/08/17/31865063/
        http://www.marinecorpstimes.com/videos/military/2015/08/17/31865063/
        http://www.navytimes.com/videos/military/2015/08/17/31865063/
        http://www.courier-journal.com/videos/sports/college/kentucky/2015/08/17/31862551/
        http://www.newarkadvocate.com/videos/sports/high-school/football/2015/08/15/31789999/
        http://www.citizen-times.com/videos/news/2015/08/17/31865067/
        http://www.bucyrustelegraphforum.com/videos/news/2015/08/15/31799953/
        http://www.sctimes.com/videos/weather/2015/08/17/31839437/
        http://www.baxterbulletin.com/videos/news/local/2015/08/17/31843911/
        http://www.delmarvanow.com/videos/sports/high-school/2015/08/18/31933549/
        http://www.courier-journal.com/videos/entertainment/2015/08/18/31920575/
        http://www.detroitnews.com/videos/sports/nfl/lions/2015/08/19/31954181/
        http://www.press-citizen.com/videos/news/education/k-12/2015/08/18/31959369/
        http://www.tennessean.com/videos/entertainment/2015/08/18/31958929/
        http://www.coloradoan.com/videos/sports/2015/08/18/31951489/
        http://www.thenewsstar.com/videos/sports/college/gsu/2015/08/18/31950105/
        http://www.hawkcentral.com/videos/sports/college/iowa/football/2015/08/13/31628619/
        http://www.sheboyganpress.com/videos/sports/golf/2015/08/16/31830213/
        http://www.packersnews.com/videos/sports/nfl/packers/2015/08/15/31800211/
        http://www.shreveporttimes.com/videos/news/2015/08/18/31906711/
        http://www.glamour.ru/video/tvorozhnyy-tort/
    */

    /* http://tv.tokyo-gas.co.jp/watch/902548399002  - Japaneese
    */

    // http://archive.jsonline.com/multimedia/video/?bctid=5047519850001&bctid=5047519850001 - new HTML 5 players
};