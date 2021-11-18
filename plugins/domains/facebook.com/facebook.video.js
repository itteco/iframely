const DEFAULT_WIDTH = 640;

export default {

    re: [
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/watch\/?\?(?:.+&)?v=/i
    ],

    mixins: ["fb-error"],

    getLink: function(url, oembed, options) {

        var html = oembed.html.replace(/connect\.facebook\.net\/\w{2}_\w{2}\/sdk\.js/i, 
                'connect.facebook.net/' + options.getProviderOptions('locale', 'en_US').replace('-', '_') + '/sdk.js'); 

        var link = {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.ssl, CONFIG.R.html5],
        }; 
   

        if (options.getRequestOptions('facebook.show_text', false) || options.getProviderOptions(CONFIG.O.more, false)) {
            html = html.replace(/data\-show\-text=\"(true|false)\"/i, ''); // future-proof
            html = html.replace(/class=\"fb\-video\"/i, 'class="fb-video" data-show-text="true"');
            link.rel.push(CONFIG.R.app);
        } else {
            link.rel.push(CONFIG.R.player);
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

        link.html = html;

        return link;
    },

    tests: [
        "http://www.facebook.com/video/video.php?v=4253262701205&set=vb.1574932468&type=2",
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=4392385966850",
        "https://business.facebook.com/KMPHFOX26/videos/10154356403004012/",
        "https://www.facebook.com/sugarandsoulco/videos/1484037581637646/?pnref=story",
        "https://www.facebook.com/watch/?v=235613163792499",
        {noFeeds: true}, {skipMixins: ["fb-error"]}
    ]
};