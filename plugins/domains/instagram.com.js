const cheerio = require('cheerio');
const decodeHTML5 = require('entities').decodeHTML5;

module.exports = {

    /**
     * HEADS-UP: New endpoints as of Oct 24, 2020:
     * https://developers.facebook.com/docs/instagram/oembed/
     * Please configure your `access_token` in your local config file
     * as desribed on https://github.com/itteco/iframely/issues/284.
     */     

    re: [
        /^https?:\/\/www\.instagram\.com\/(?:[a-zA-Z0-9_\-\.]+\/)?(?:p|tv|reel)\/([a-zA-Z0-9_-]+)\/?/i,
        /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_\-\.]+\/)?p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.instagram\.com\/(?:[a-zA-Z0-9_\-\.]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-site",
        "oembed-author",
        // "og-image", // it's the same as size L
        "domain-icon",
        "fb-error"
    ],

    getMeta: function (oembed, urlMatch, meta) {
        var title = meta.og && meta.og.title ? meta.og.title.match(/([^•\":“]+)/i)[0]: '';
        var description = oembed.title;

        if (!description || !title || /login/i.test(title)) {
            var $container = cheerio('<div>');
            try {
                $container.html(decodeHTML5(oembed.html));
            } catch (ex) {}

            if (!title || /login/i.test(title)) {
                var $a = $container.find(`p a[href*="${oembed.author_name}"], p a[href*="${urlMatch[1]}"]`);

                if ($a.length == 1) {
                    title = $a.text();
                    title += /@/.test(title) ? '' : ` (@${oembed.author_name})`;
                } else {
                    title = `Instagram (@${oembed.author_name})`;
                }
            }

            if (!description) {
                var $a = $container.find(`p a[href*="${urlMatch[1]}"]`);
                description = $a.text();
            }
        }

        return {
            title: title,
            description: description
        }
    },

    getLinks: function(url, urlMatch, meta, oembed, options) {
        var src = 'https://instagram.com/p/' + urlMatch[1] + '/media/?size=';

        var aspect = oembed.thumbnail_width && oembed.thumbnail_height ? oembed.thumbnail_width / oembed.thumbnail_height : 1/1

        var links = [];

        if (oembed.thumbnail_url) {
            links.push({
                href: oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
                // No media - let's validate image as it may be expired.
            });
        }

        if (meta.og && meta.og.image) {
            links.push({
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: meta.og.video ? CONFIG.R.thumbnail : [CONFIG.R.image, CONFIG.R.thumbnail]
                // No media - let's validate image as it may be expired.
            });
        }        

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

            html = html.replace(/src="\/\/www\.instagram\.com\/embed\.js"/, 'src="https://www.instagram.com/embed.js"');

            if (/instagram.com\/tv\//i.test(html)) {
                // html has /tv/ links in it - but those actually don't work as of 8/27/2018
                html = html.replace(/instagram.com\/tv\//g, 'instagram.com/p/');
            }

            // Fix for private posts that later became public
            if (urlMatch[1] && urlMatch[1].length > 30 
                && /^https?:\/\/www\.instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/i.test(meta.canonical)) {
                html = html.replace(url, meta.canonical);
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
        var result = {};
        options.followHTTPRedirect = true;
        options.exposeStatusCode = true;        

        if (!options.getRequestOptions('instagram.meta', true)) {
            result.meta = {};
        }

        if (urlMatch[1] && urlMatch[1].length > 30) {
            result.message = 'This Instagram post is private.'; // IDs longer than 30 is for private posts as of March 11, 2020
        }

        if (!options.redirectsHistory && (/^https?:\/\/instagram\.com\//i.test(url) || /^http:\/\/www\.instagram\.com\//i.test(url))) {
            result.redirect = url.replace(/^http:\/\//, 'https://').replace(/^https:\/\/instagram\.com\//i, 'https://www.instagram.com');
        }

        return result;
    },

    tests: [{
        noFeeds: true
    },
        "https://www.instagram.com/p/HbBy-ExIyF/",
        "https://www.instagram.com/p/a_v1-9gTHx/",
        "https://www.instagram.com/p/-111keHybD/",
        {
            skipMixins: ["oembed-title", "fb-error"],
            skipMethods: ['getData']
        }
    ]
};