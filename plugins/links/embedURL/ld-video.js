import * as cheerio from 'cheerio';


export default {

    provides: [
        'schemaVideoObject', 
        'video_src'
    ],

    getData: function(ld, whitelistRecord, utils, url) {

        var json = utils.findMainLdObjectWithVideo(ld);

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
    https://www.autonews.fr/actualite/nouvelle-alpine-a110s-notre-video-exclusive-sur-circuit-86133

    Movie:
    https://www.fandango.com/movie-trailer/x-men-days-of-future-past/159281?autoplay=true&mpxId=2458744940

    With <iframe>:
    https://matchtv.ru/programms/karpin/matchtvvideo_NI749522_clip_Kvinsi_Promes_poluchajet_priz_ot_Valerija_Karpina
    */
};
