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

        if (/comment_id=\d+/i.test(url)) {
            var width = options.maxWidth || options.getProviderOptions('facebook.width', DEFAULT_WIDTH);
            link.rel.push (CONFIG.R.app);

            if (!/class=\"fb\-comment\-embed\"/i.test(html)) {
                // thank you FB for not working with comments
                // https://developers.facebook.com/docs/plugins/embedded-comments
                html = html.replace(/class=\"fb\-video\"/i, 'class="fb-comment-embed"' + (/data\-width=/i.test(html) ? '' : ' data-width="' + width + '"'));
            }

            if (/&reply_comment_id=/i.test(url)) {
                html = html.replace(/data\-include\-parent=\"(true|false)\"/i, ''); // future-proof
                html = html.replace(/class=\"fb\-comment\-embed\"/i, 
                    'class="fb-comment-embed" data-include-parent="' 
                    + (options.getRequestOptions('facebook.include_comment_parent', false) || options.getProviderOptions(CONFIG.O.more, false)) + '"');
                
                link.options = {
                    include_comment_parent: {
                        label: "Include parent comment (if url is a reply)",
                        value: /data\-include\-parent=\"true\"/i.test(html)
                    }
                };
            } else {
                link['max-width'] = width;
            }

        } else {            

            if (options.getRequestOptions('facebook.show_text', false) || options.getProviderOptions(CONFIG.O.more, false)) {
                html = html.replace(/data\-show\-text=\"(true|false)\"/i, ''); // future-proof
                html = html.replace(/class=\"fb\-video\"/i, 'class="fb-video" data-show-text="true"');
                link.rel.push (CONFIG.R.app);
            } else {
                link.rel.push (CONFIG.R.player);
            }

            link.options = {
                show_text: { // different name from posts to allow separate config and defaults
                    label: 'Show author\'s text caption',
                    value: /data-show-text=\"true\"/i.test(html)
                }
            }

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