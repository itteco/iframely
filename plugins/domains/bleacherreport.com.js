module.exports = {
 
    mixins: ["*"],

    getLink: function (oembed) {

        if (oembed.type === 'video' && oembed.video_id) {
            return {
                href: "http://bleacherreport.com/video_embed?id=" + oembed.video_id,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': 630 / 355
            }
        }
    },

    getMeta: function (oembed) {

        if (oembed.type === 'video' && oembed.video_id) {
            return {
                media: "player"
            }
        }
    },

    highestPriority: true,    

    tests: [
        "http://bleacherreport.com/articles/2522329-cam-newton-most-fun-substitute-teacher-ever"
        // Should not work - http://bleacherreport.com/articles/2580263-newsman-says-michigan-beat-michigan-state-while-reporting-outside-the-big-house (embeded video)
        // Should not work - http://bleacherreport.com/articles/2586711-is-a-high-powered-offense-or-stingy-defense-a-better-path-to-2015-cfb-playoff (article)
    ]
};