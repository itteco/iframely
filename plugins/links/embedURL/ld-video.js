module.exports = {

    provides: [
        'schemaVideoObject', 
        'video_src'
    ],

    getData: function(ld, whitelistRecord, url) {

        if (ld.videoobject) {

            var data = {
                schemaVideoObject: ld.videoobject
            };

            var video_src = ld.videoobject.embedurl || ld.videoobject.embedUrl || ld.videoobject.contenturl || ld.videoobject.contentUrl;

            if (video_src && typeof video_src === "string" && whitelistRecord.isAllowed && (whitelistRecord.isDefault || !whitelistRecord.isAllowed('html-meta.embedURL'))
                && /(youtube|youtu|youtube\-nocookie|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc|podbean|simplecast|libsyn|wistia|brightcove)\./i.test(video_src)
                && !/(youtube|youtu|youtube\-nocookie|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc|libsyn|wistia|brightcove)\./i.test(url)) {

                data.video_src = video_src;
            }
        
            return data;
        }
    }

    /*
    http://video.eurosport.com/football/who-will-nelson-the-hornbill-pick-to-win-in-france-v-romania_vid809882/video.shtml
    http://video.eurosport.fr/football/coupe-de-france/2015-2016/video-granville-bourg-en-bresse-les-temps-forts_vid471598/video.shtml
    http://video.eurosport.de/tennis/australian-open/2017/australian-open-2017-boris-becker-spricht-klartext-3-grunde-fur-das-aus-von-zverev-gegen-federer_vid954898/video.shtml
    http://video.eurosport.co.uk/cycling/tour-de-france/2016/science-of-cycling-the-echelon-how-to-deal-with-a-crosswind_vid817450/video.shtml
    http://www.hgtv.com/videos/small-home-in-tucson-arizona-0210527
    http://www.travelchannel.com/videos/exorcism-of-roland-doe-0203807
    */
};