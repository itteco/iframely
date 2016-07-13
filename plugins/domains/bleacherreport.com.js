var $ = require('cheerio');

module.exports = {
 
    mixins: ["*"],

    getLink: function (oembed) {

        if (oembed.type === 'video' && oembed.video_id) {

            var $container = $('<div>');
            try {
                $container.html(oembed.html);
            } catch(ex) {}

            var $videodiv = $container.find('.video-player');
            var library = '';

            if ($videodiv.length == 1 && $videodiv.attr('data-library')) {
                library = '&library=' + $videodiv.attr('data-library');
            }


            return {
                href: "http://bleacherreport.com/video_embed?id=" + oembed.video_id + library,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': 630 / 355
            }
        }
    },

    getMeta: function (oembed) {

        if (oembed.type === 'video' && oembed.video_id) {
            return {
                media: "player", 
                views: oembed.article_reads,
                videoId: oembed.video_id
            }
        }
    },

    highestPriority: true,    

    tests: [
        "http://bleacherreport.com/articles/2522329-cam-newton-most-fun-substitute-teacher-ever",
        "http://bleacherreport.com/articles/2650400-4-star-ot-kai-leon-herbert-makes-college-decision-with-walking-dead-commitment"
        // Should not work - http://bleacherreport.com/articles/2580263-newsman-says-michigan-beat-michigan-state-while-reporting-outside-the-big-house (embeded video)
        // Should not work - http://bleacherreport.com/articles/2586711-is-a-high-powered-offense-or-stingy-defense-a-better-path-to-2015-cfb-playoff (article)
    ]
};