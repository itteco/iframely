const cheerio = require('cheerio').default;

module.exports = {

    provides: [
        'schemaVideoObject', 
        'video_src'
    ],

    getData: function(ld, whitelistRecord, url) {

        var json = ld.videoobject 
                    || ld.mediaobject 
                    || (ld.newsarticle && (ld.newsarticle.video || ld.newsarticle.videoobject)) 
                    || (ld.tvepisode && (ld.tvepisode.video || ld.tvepisode.videoobject))
                    || (ld.movie && (ld.movie.video || ld.movie.videoobject))
                    || (ld.tvclip && (ld.tvclip.video || ld.tvclip.videoobject));

        if (json) {

            var video_src = json.embedurl || json.embedUrl || json.embedURL || json.contenturl || json.contentUrl || json.contentURL;

            if (/^<iframe.*<\/iframe>$/i.test(video_src)) {
                var $container = cheerio('<div>');
                try {
                    $container.html(video_src);
                } catch (ex) {}

                var $iframe = $container.find('iframe');
                if ($iframe.length == 1 && $iframe.attr('src')) {

                    json.embedurl = $iframe.attr('src');
                    video_src = $iframe.attr('src'); // For KNOWN check below.

                    if (!json.width && $iframe.attr('width')) {
                        json.width = $iframe.attr('width');
                    }

                    if (!json.height && $iframe.attr('height')) {
                        json.height = $iframe.attr('height');
                    }
                }
            }


            var data = {
                schemaVideoObject: json
            };            

            if (video_src && typeof video_src === "string" 
                && whitelistRecord.isAllowed 
                && (whitelistRecord.isDefault || whitelistRecord.isAllowed('html-meta.embedURL') === undefined)
                && CONFIG.KNOWN_VIDEO_SOURCES.test(video_src)
                && !CONFIG.KNOWN_VIDEO_SOURCES.test(url)) {

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
    https://www.parismatch.com/People/Delon-Belmondo-duel-au-sommet-pour-Paris-Match-1630358?jwsource=cl

    Movie:
    https://www.fandango.com/movie-trailer/x-men-days-of-future-past/159281?autoplay=true&mpxId=2458744940

    With <iframe>:
    https://matchtv.ru/programms/karpin/matchtvvideo_NI749522_clip_Kvinsi_Promes_poluchajet_priz_ot_Valerija_Karpina
    */
};