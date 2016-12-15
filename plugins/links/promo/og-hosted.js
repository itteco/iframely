module.exports = {

    provides: 'video_src',

    getData: function(url, og, whitelistRecord) {

        // do not process if there is a whitelist record for this domain as processing will take longer
        if (!whitelistRecord.isDefault && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {return;}
        
        var video_src = (og.video && (og.video.url || og.video.secure_url)) || (og.video && og.video.iframe) || og.video;

        if (video_src && !(video_src instanceof Array)
            && /(youtube|youtu|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc)\./i.test(video_src)
            && !/(youtube|youtu|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc)\./i.test(url)) {

            if (/^\/\//.test(video_src)) {
                video_src = 'http:' + video_src;
            }
            return {
                video_src: video_src
            };

        }

    }
};