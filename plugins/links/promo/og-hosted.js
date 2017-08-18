module.exports = {

    provides: 'video_src',

    getData: function(url, og, whitelistRecord) {

        // do not process if there is a whitelist record for this domain as processing will take longer
        if (!whitelistRecord.isDefault && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {return;}
        
        var video = og.video && (og.video instanceof Array  && og.video.length > 1 ? og.video[1] : og.video);
        var video_src = (video && (video.url || video.secure_url)) || (video && video.iframe) || video;

        if (video_src && !(video_src instanceof Array)
            && /(youtube|youtu|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc|wistia|kaltura|mtvnservices|bcove)\./i.test(video_src)
            && !/(youtube|youtu|vimeo|dailymotion|theplatform|jwplatform|cnevids|newsinc|wistia|kaltura|mtvnservices|bcove)\./i.test(url)) {

            if (/^\/\//.test(video_src)) {
                video_src = 'http:' + video_src;
            }
            return {
                video_src: video_src
            };

        }

    }
};