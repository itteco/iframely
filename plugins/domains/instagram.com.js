module.exports = {

    re: [
        /^https?:\/\/www\.instagram\.com\/(?:[a-zA-Z0-9_\-\.]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)\/?/i,
        /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_\-\.]+\/)?p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.instagram\.com\/(?:[a-zA-Z0-9_\-\.]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-site",
        "oembed-author",
        // "og-image", it's the same as size L
        "domain-icon",
        "oembed-error"
    ],

    getMeta: function (og, oembed) {
        
        return {
            title: og.title ? og.title.match(/([^•\"]+)/i)[0] : "Post on Instagram",
            description: oembed.title
        }

    },

    getLinks: function(urlMatch, meta, oembed, options) {
        var src = 'https://instagram.com/p/' + urlMatch[1] + '/media/?size=';

        var aspect = oembed.thumbnail_width && oembed.thumbnail_height ? oembed.thumbnail_width / oembed.thumbnail_height : 1/1

        var links = [
            // Images.
            {
                href: src + 't',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: Math.round(150 * aspect),
                height: 150 
            }, {
                href: src + 'm',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: Math.round(aspect * 306),
                height: 306
            }, {
                href: src + 'l',
                type: CONFIG.T.image,
                rel: (meta.og && meta.og.video) ? CONFIG.R.thumbnail : [CONFIG.R.image, CONFIG.R.thumbnail],
                width: Math.round(aspect * 612),
                height: 612
            } 
            /*
            // return expanded image thumbnails if /p/shortcode/media stops working again
            // it works as of Nov 20, 2019
            {
                href: oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
                // validate image as it may be expired
            }, {
                href: meta.og && meta.og.image,
                type: CONFIG.T.image,
                rel: (meta.og && meta.og.video) ? CONFIG.R.thumbnail : [CONFIG.R.image, CONFIG.R.thumbnail]
                // validate image as it may be expired
            }*/];

        if (meta.og && meta.og.video) {
            links.push({
                href: meta.og.video.url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
            links.push({
                href: meta.og.video.secure_url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
        }

        if (oembed.type === 'rich') {

            var html = oembed.html;
            var captioned = /data\-instgrm\-captioned/i.test(html);

            if (!captioned && (options.getRequestOptions('instagram.showcaption', false) || options.getProviderOptions(CONFIG.O.more, false))) {
                html = html.replace(" data-instgrm-version=", " data-instgrm-captioned data-instgrm-version=");
            }

            if (captioned && (!options.getRequestOptions('instagram.showcaption', true) || options.getProviderOptions(CONFIG.O.less, false))) {
                html = html.replace("data-instgrm-captioned ", "");
            }

            captioned = /data\-instgrm\-captioned/i.test(html);

            html = html.replace (/src="\/\/www\.instagram\.com\/embed\.js"/, 'src="https://www.instagram.com/embed.js"');

            if (/instagram.com\/tv\//i.test(html)) {
                // html has /tv/ links in it - but those actually don't work as of 8/27/2018
                html = html.replace (/instagram.com\/tv\//g, 'instagram.com/p/');
            }

            var app = {
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline],
                'max-width': 660,
                'min-width': 326,
                options: {
                    showcaption: {
                        label: 'Show author\'s text caption',
                        value: captioned
                    }
                }
            };

            if (oembed.thumbnail_width && oembed.thumbnail_height) {
                // sizes for placeholder are hardcoded anyway, no need to link them to the image sizes
                app['aspect-ratio'] = 100 / (2 *(19 + 12.5)); // was: oembed.thumbnail_width / oembed.thumbnail_height;
                app['padding-bottom'] = 284;//  was: 206;

            }

            links.push(app);
        }

        return links;
    },

    getData: function (url, urlMatch, options) {

        // Avoid any issues with possible redirects,
        // But let private posts (>10 digits) redirect and then fail with 404 (oembed-error) and a message.
        options.followHTTPRedirect = true; 
        if (urlMatch[1] && urlMatch[1].length > 30) {
            return {
                message: 'This Instagram account is private.' // IDs longer than 30 is for private posts as of March 11, 2020
            }
        }

        if (!options.redirectsHistory && (/^https?:\/\/instagram\.com\//i.test(url) || /^http:\/\/www\.instagram\.com\//i.test(url))) {
            return {
                redirect: url.replace(/^http:\/\//, 'https://').replace(/^https:\/\/instagram\.com\//i, 'https://www.instagram.com')
            }
        }
    },

    tests: [{
        page: "http://blog.instagram.com/",
        selector: ".photogrid a"
    },
        "https://www.instagram.com/p/HbBy-ExIyF/",
        "https://www.instagram.com/p/a_v1-9gTHx/",
        "https://www.instagram.com/p/-111keHybD/",
        {
            skipMixins: ["oembed-title", "oembed-error"],
            skipMethods: ['getData']
        }
    ]
};