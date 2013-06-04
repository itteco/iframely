module.exports = {

    re: /^http:\/\/www\.theonion\.com\/video\/*/i,

    mixins: [
        "canonical",
        "favicon",
        "og-image",
        "copyright",
        "og-description",
        "og-title"
    ],

    getData: function($selector) {

        var $html = $selector('section.article-content')

        if ($html.length) {

            var $image = $selector('figure.article-image img');

            var html = '';

            if ($image.length) {
                html = $image.parent().html();
            }

            html += $html.html();

            return {
                html_for_readability: html,
                ignore_readability_error: true
            }
        }
    },


    getLink: function($selector) {

        var $video = $selector('video');
        if (!$video.length || !$video.attr('id')) return;

        return {
            href: 'http://www.theonion.com/video_embed/?id=' + $video.attr('id'),
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 480 / 270
        }
    },   

    tests: [{
        pageWithFeed: "http://www.theonion.com/video/"
    }]
};