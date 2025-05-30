import cheerio from 'cheerio';

import { decodeHTML5 } from 'entities';

export default {

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
        // "og-image",
        // "canonical",
        "domain-icon",
        "fb-error"
    ],

    provides: ['ipOG', '__allowInstagramMeta'],

    getMeta: function (oembed, urlMatch, ipOG) {

        var title = ipOG.title;
        var description = ipOG.description || oembed.title;

        if (!description || !title || /login/i.test(title)) {
            var $container = cheerio('<div>');
            try {
                $container.html(decodeHTML5(oembed.html));
            } catch (ex) {}

            if (!title || /login/i.test(title)) {
                var $a = $container.find(`p a[href*="${oembed.author_name}"], p a[href*="${urlMatch[1]}"]`);

                if ($a.length == 1) {
                    title = $a.text();
                    title += /@/.test(title) ? '' : (oembed.author_name ? ` (@${oembed.author_name})` : '');
                } else if (oembed.author_name) {
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
            description: description,
            canonical: `https://www.instagram.com/p/${urlMatch[1]}`
        }
    },

    getLinks: function(url, urlMatch, ipOG, oembed, options) {

        var links = [];

        if (oembed.thumbnail_url) {
            links.push({
                href: oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
                // No media - let's validate image as it may have expired.
            });
        }

        var isReel = /\/reel\//i.test(url); // Reels don't work without a caption

        if (ipOG.image) {
            links.push({
                href: ipOG.image,
                type: CONFIG.T.image,
                rel: ipOG.video || isReel ? CONFIG.R.thumbnail : [CONFIG.R.image, CONFIG.R.thumbnail],
                // No media - let's validate image as it may be expired.

                // Remove below error when and if it's fixed. Validators will remove the link
                error: oembed.is_fallback ? null : 'Unfortunatelly Instagram\'s OG image is cropped as of 2023-10-11 and as of 2024-02-02'
            });
        }        

        if (ipOG.video && ipOG.video.width && ipOG.video.height) {
            links.push({
                href: ipOG.video.url,
                accept: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": ipOG.video.width / ipOG.video.height
            });
        }

        if (oembed.type === 'rich') {

            var html = oembed.html;
            var captioned = /data\-instgrm\-captioned/i.test(html);

            if (!captioned && options.getRequestOptions('instagram.showcaption', false)) {
                html = html.replace(" data-instgrm-version=", " data-instgrm-captioned data-instgrm-version=");
            }

            if (captioned && !options.getRequestOptions('instagram.showcaption', true)) {
                html = html.replace("data-instgrm-captioned ", "");
            }

            captioned = /data\-instgrm\-captioned/i.test(html);

            html = html.replace(/src="\/\/platform\.instagram\.com\/en_US\/embeds\.js"/, 'src="https://www.instagram.com/embed.js"');

            if (/instagram.com\/tv\//i.test(html)) {
                // html has /tv/ links in it - but those actually don't work as of 8/27/2018
                html = html.replace(/instagram.com\/tv\//g, 'instagram.com/p/');
            }

            // Fix for private posts that later became public
            if (urlMatch[1] && urlMatch[1].length > 30 
                && /^https?:\/\/www\.instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/i.test(ipOG.url)) {
                html = html.replace(url, ipOG.url);
            }

            var app = {
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline],
                // sizing is from Instagram placeholder to avoid double height changes
                'max-width': 660,
                'aspect-ratio': 100 / (2 *(19 + 12.5)), // was: oembed.thumbnail_width / oembed.thumbnail_height, but sizes for placeholder are hardcoded anyway, no need to link them to the image sizes
                'padding-bottom': 284,
                options: {
                    showcaption: {
                        label: 'Show author\'s text caption',
                        value: captioned
                    }
                }
            };

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

        if (!options.getProviderOptions('instagram.meta', true)) {
            result.ipOG = {};
        } else {
            result.__allowInstagramMeta = true;
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
        "https://www.instagram.com/reel/CtHaSoDLrWJ/",
        "https://www.instagram.com/nssmagazine/reel/CrVt-Wvs74O/",
        {
            skipMixins: ["oembed-title", "fb-error", "oembed-author"],
            skipMethods: ['getData']
        }
    ]
};