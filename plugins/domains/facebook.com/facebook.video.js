const utils = require('../../../lib/utils');
const DEFAULT_WIDTH = 640;

module.exports = {

    re: [
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i
    ],

    getLink: function(url, oembed, options) {

        var html = oembed.html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i, 
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US').replace('-', '_') + '/sdk.js'); 

        var link = {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.ssl, CONFIG.R.html5],
        }; 

        if (/comment_id=\d+/i.test(url) && !/class=\"fb\-comment\-embed\"/.test(html)) {
            // thank you FB for not working with comments
            // https://developers.facebook.com/docs/plugins/embedded-comments

            var width = options.maxWidth || options.getProviderOptions('facebook.width', 640);
            html = html.replace(/class=\"fb\-video\"/, 
                'class="fb-comment-embed" data-include-parent="'
                + (options.getProviderOptions('facebook.include_comment_parent') || options.getProviderOptions(CONFIG.O.more) ? 'true' : 'false') + '"'
                + (/data\-width=/i.test(html) ? '' : ' data-width="' + width + '"')
                );
            link.rel.push (CONFIG.R.app);

            if (/&reply_comment_id=/i.test(url)) {
                link.options = utils.getVary(options, 
                    html.indexOf('data-include-parent="true"') > -1, //isMax
                    html.indexOf('data-include-parent="false"') > -1, //isMin
                    { // Min/max messages, null if not supported for particular URL
                        min: "Exclude parent",
                        max: "Include parent"
                    }
                );
            } else {
                link['max-width'] = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);
            }

        } else {

            link.rel.push (CONFIG.R.player);

            if (options.getProviderOptions(CONFIG.O.more) && !/data\-show\-text/.test(html)) {
                html = html.replace(/class=\"fb\-video\"/, 'class="fb-video" data-show-text="true"');
            }

            link.options = utils.getVary(options, 
                html.indexOf('data-show-text="true"') > -1, //isMax
                html.indexOf('ata-show-text="true"') == -1, //isMin
                { // Min/max messages, null if not supported for particular URL
                    min: "Do not include user's post",
                    max: "Include user's post"
                }
            );

            if (oembed.width && oembed.height) {
                link['aspect-ratio'] = oembed.width / oembed.height;
            }

        }

        link.html = html;

        return link;
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=4392385966850",
        "https://www.facebook.com/joe.yu.94/videos/10206321173378788/",
        "https://business.facebook.com/KMPHFOX26/videos/10154356403004012/",
        "https://www.facebook.com/tv2nyhederne/videos/1657445024271131/?comment_id=1657463030935997",
        "https://www.facebook.com/MeanwhileinCanada1/videos/1302492646464430/",
        "https://www.facebook.com/sugarandsoulco/videos/1484037581637646/?pnref=story",
        {
            noFeeds: true
        }
    ]
};