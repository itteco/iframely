module.exports = {

    provides: '__promoUri',

    getData: function(url, og, whitelistRecord) {

        // do not process if there is a whitelist record for this domain as processing will take longer
        if (!whitelistRecord.isDefault && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {return;}
        
        var video_src = (og.video && og.video.url) || og.video;
        if (!video_src || /youtube\.com|vimeo\.com|dailymotion\.com/.test(url)) {
            return;
        }

        // Allow YouTube
        var urlMatch = video_src.match(/^https?:\/\/(?:www\.)?youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube-nocookie\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/youtube\.googleapis\.com\/v\/([\-_a-zA-Z0-9]+)/i) //youtube.googleapis.com/v/k3Cd2lvQlN4?rel=0
                    || video_src.match(/https?:\/\/www.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtu\.be\/([\-_a-zA-Z0-9]+)/i);

        if (urlMatch) {
            return {
                __promoUri: "https://www.youtube.com/watch?v=" + urlMatch[1]
            };
        }


        // or Vimeo
        urlMatch = video_src.match(/^https?:\/\/vimeo\.com\/(\d+)/i)
                    || video_src.match(/^https?:\/\/player.vimeo\.com\/video\/(\d+)/i)
                    || video_src.match(/https?:\/\/vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i);


        if (urlMatch) {
            return {
                __promoUri: "https://vimeo.com/" + urlMatch[1]
            };
        } 


        // or DailyMotion, e.g. Liberation, Le Point, L'Express
        urlMatch = video_src.match(/^https?:\/\/www\.dailymotion\.com\/(?:swf|embed)?\/?video\/([_a-zA-Z0-9\-]+)/i);

        if (urlMatch) {
            return {
                __promoUri: "http://www.dailymotion.com/video/" + urlMatch[1]
            };
        } 


    }
};