module.exports = {

    re: [
        /^https?:\/\/www\.bloomberg\.com\/news\/videos\/(\d{4}\-\d{2}\-\d{2}\/[a-zA-Z0-9\-]+)/i,
        /^https?:\/\/www\.bloomberg\.com\/news\/videos\/(b\/[a-zA-Z0-9-]+)/i,
        /^https?:\/\/www\.bloomberg\.com\/video\/([a-zA-Z0-9-]+)\.html$/i
    ],

    mixins: ['*'],

    provides: 'bmmr',

    getData: function(urlMatch, request, cb) {

        request({
            uri: "http://www.bloomberg.com/api/videos/slug/" + urlMatch[1],
            json: true,
            prepareResult: function(error, response, body, cb) {

                if (error) {
                    return cb(error);
                }

                var video_id = body.type === 'video' && body.attachments && body.attachments.video && body.attachments.all && body.attachments.all[0] && body.attachments.all[0].type === 'video' 
                            ? body.attachments.all[0].id : null;

                var video = video_id && body.attachments.video [video_id];

                if (video_id && video) {                        
                    cb(null, {
                        bmmr: video
                    });
                } else {
                    cb(null);
                }
            }
        }, cb);
    },

    getLink: function(bmmr) {

        if (bmmr.bmmrId) {
            return {
                href: 'https://www.bloomberg.com/api/embed/iframe?id=' + bmmr.bmmrId,                
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16 / 9
            };
        }
    },

    tests: [{
        noFeeds: true
    },
        "http://www.bloomberg.com/news/videos/2015-03-05/why-cheap-oil-doesn-t-stop-the-drilling"
    ]
};