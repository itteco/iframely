module.exports = {

    provides: '__promoUri',

    getData: function(og) {
        
        var video_src = (og.video && og.video.url) || og.video;
        if (!video_src) {
            return;
        }

        var urlMatch = video_src.match(/^https?:\/\/www\.youtube\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube-nocookie\.com\/v\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/www\.youtube\.com\/embed\/([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/^https?:\/\/youtube\.googleapis\.com\/v\/([\-_a-zA-Z0-9]+)/i) //youtube.googleapis.com/v/k3Cd2lvQlN4?rel=0
                    || video_src.match(/https?:\/\/www.youtube\.com\/watch\?v=([\-_a-zA-Z0-9]+)/i)
                    || video_src.match(/https?:\/\/youtu\.be\/([\-_a-zA-Z0-9]+)/i);

        if (urlMatch) {
            return {
                __promoUri: "https://www.youtube.com/watch?v=" + urlMatch[1]
            };
        }


        urlMatch = video_src.match(/^https?:\/\/vimeo\.com\/(\d+)/i)
                    || video_src.match(/^https?:\/\/player.vimeo\.com\/video\/(\d+)/i)
                    || video_src.match(/https?:\/\/vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i);


        if (urlMatch) {
            return {
                __promoUri: "https://vimeo.com/" + urlMatch[1]
            };
        } 


    }
};