module.exports = {

    provides: '__promoUri',    

    getData: function(url, meta, whitelistRecord) {

        if (!whitelistRecord.isDefault && ((meta.og && meta.og.image) || (meta.twitter && meta.twitter.image))) {return;}

        if (url.match(/^https?:\/\/link\.brightcove\.com\/services\/player\/bcpid(\d+)\?/i)) {return;}
        // do not process links to itself, otherwise -> infinite recursion


        if (!meta.twitter && !meta.og) {return;}
        
        var video_src = (meta.twitter && ((meta.twitter.player && meta.twitter.player.value) || meta.twitter.player));

        if (!video_src && meta.og) {

            var ogv = meta.og.video instanceof Array ? meta.og.video[0] : meta.og.video;
            video_src = ogv && (ogv.url || ogv.secure_url);          
        }

        if (!video_src || !/\.brightcove\.com\/services\//i.test(video_src)) {
            return;
        }
        

        var urlMatch = video_src.match(/^https?:\/\/link\.brightcove\.com\/services\/player\/bcpid(\d+)\?/i);

        if (urlMatch) {

            return {
                __promoUri: video_src
            };
        }

        if (/^https?:\/\/(?:c|secure)\.brightcove\.com\/services\/viewer\/federated_f9\//i.test(video_src)) {
            var playerID = video_src.match(/playerID=([^&]+)/i);
            var videoID = video_src.match(/videoID=([^&]+)/i); // some have `Id` for some reason

            if (playerID && videoID) {

                return {
                    __promoUri: "http://link.brightcove.com/services/player/bcpid" + playerID[1] + "?bctid=" + videoID[1]
                };
            }

        }
    }


    /* Sample URLs with BrightCove Twitter Players:
        http://www.channel4.com/programmes/the-mill/videos/all/s1-ep2-the-introduction - unless denied
        https://secure.brightcove.com/services/viewer/federated_f9/?isVid=1&isUI=1&playerID=3736190525001&autoStart=true&videoId=4427524835001&secureConnections=true
        https://link.brightcove.com/services/player/bcpid3736190525001?bctid=4427524835001        
    */

    /* Sample URLs with BrightCove Twitter Flash Players:
        http://www.daytondailynews.com/videos/news/national/can-divorce-lawyers-benefit-from-ashley-madison/vDYt3k/
        http://www.actionnewsjax.com/videos/news/raw-video-lonzies-mom-being-booked-into-jail/vDYtd2/
        ?? http://www.guampdn.com/videos/news/nation/2015/08/18/31948487/
        http://www.wsbtv.com/videos/news/former-dekalb-ceo-burrell-ellis-found-guilty-on-4/vDWhGf/
        http://www.news965.com/videos/news/national/can-divorce-lawyers-benefit-from-ashley-madison/vDYt3k/
        http://www.journal-news.com/videos/sports/cardale-jones-on-offenses-potential/vDYXCh/            
    */    

    /* Sample URLs with BrightCove OG Players: 
        ?? http://www.airforcetimes.com/videos/military/2015/08/17/31865063/
        http://www.marinecorpstimes.com/videos/military/2015/08/17/31865063/
        http://www.navytimes.com/videos/military/2015/08/17/31865063/
        http://www.brainerddispatch.com/video/4427751664001
        http://www.courier-journal.com/videos/sports/college/kentucky/2015/08/17/31862551/
        http://www.newarkadvocate.com/videos/sports/high-school/football/2015/08/15/31789999/
        http://www.citizen-times.com/videos/news/2015/08/17/31865067/
        http://www.bucyrustelegraphforum.com/videos/news/2015/08/15/31799953/
        http://www.sctimes.com/videos/weather/2015/08/17/31839437/
        http://www.baxterbulletin.com/videos/news/local/2015/08/17/31843911/
        http://www.brainerddispatch.com/video/4419816680001
        http://www.duluthnewstribune.com/video/4422226346001
        http://www.echopress.com/video/4419260186001
        http://www.echopress.com/video/4419259483001
        http://www.dglobe.com/video/4419226888001
        http://www.farmingtonindependent.com/video/4419226888001
        http://www.democratandchronicle.com/videos/lifestyle/rocflavors/recipes/2015/08/11/rocflavors-baking-and-cooking-tips-recipes/31461591/
        http://www.dl-online.com/video/4402208751001
        http://www.delmarvanow.com/videos/sports/high-school/2015/08/18/31933549/
        http://www.courier-journal.com/videos/entertainment/2015/08/18/31920575/
        http://www.detroitnews.com/videos/sports/nfl/lions/2015/08/19/31954181/
        http://www.inforum.com/video/4430933930001
        http://www.echopress.com/video/4430933890001
        http://www.dl-online.com/video/4430933890001
        http://www.press-citizen.com/videos/news/education/k-12/2015/08/18/31959369/
        http://www.tennessean.com/videos/entertainment/2015/08/18/31958929/
        http://www.coloradoan.com/videos/sports/2015/08/18/31951489/
        http://www.thenewsstar.com/videos/sports/college/gsu/2015/08/18/31950105/
        http://www.hawkcentral.com/videos/sports/college/iowa/football/2015/08/13/31628619/
        http://www.sheboyganpress.com/videos/sports/golf/2015/08/16/31830213/
        http://www.currenttime.tv/media/video/27195799.html
        http://www.packersnews.com/videos/sports/nfl/packers/2015/08/15/31800211/
        http://www.shreveporttimes.com/videos/news/2015/08/18/31906711/
        http://www.hudsonstarobserver.com/video/4384889790001
    */
};