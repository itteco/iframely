const querystring = require('querystring');
const _ = require('underscore');

module.exports = {

    re: /^https:\/\/vimeo\.com(?:\/channels?\/\w+)?\/\d+/i, // Includes private reviews like /video/123/ABC.

    mixins: [
        "oembed-title",
        //"oembed-thumbnail", // Allowed in getLink - only for landscape videos due to size problem.
        "oembed-author",
        "oembed-duration",
        "oembed-site",
        "oembed-description",
        "domain-icon"
    ],

    getMeta: function(oembed) {
        return {
            canonical: "https://vimeo.com/" + oembed.video_id,
            date: oembed.upload_date
        };
    },


    getLink: function(oembed, options) {

        var params = querystring.parse(options.getProviderOptions('vimeo.get_params', '').replace(/^\?/, ''));

        if (options.getProviderOptions('players.showinfo', false)) {
            params.title = 1;
            params.byline = 1;
        }

        var qs = querystring.stringify(params);
        if (qs !== '') {qs = '?' + qs}

        var links = [];

        if (oembed.thumbnail_url || !options.getProviderOptions('vimeo.disable_private', false)) {
            links.push({
                href: "https://player.vimeo.com/video/" + oembed.video_id + qs,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.thumbnail_width < oembed.thumnmail_height ? oembed.thumbnail_width / oembed.thubnail_height : oembed.width / oembed.height, // ex. portrait https://vimeo.com/216098214
                autoplay: "autoplay=1"
            });
        }

        // Let's try and add bigger image if needed, but check that it's value.
        // No need to add everywhere: some thumbnails are ok, like https://vimeo.com/183776089, but some are not - http://vimeo.com/62092214.
        if (options.getProviderOptions('images.loadSize') !== false && /\d+_\d{2,3}x\d{2,3}\.jpg$/.test(oembed.thumbnail_url)) {
            links.push({
                href:oembed.thumbnail_url.replace(/_\d+x\d+\.jpg$/, '.jpg'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            });
        }

        if (!oembed.thumbnail_url) {
            links.push({message: 'Contact support to ' + (options.getProviderOptions('vimeo.disable_private', false) ? 'enable' : 'disable')+ ' Vimeos with site restrictions.'});
        } else if (oembed.width > oembed.height) { // oEmbed comes with the wrong thumbnail sizes for portrait videos
            links.push({
                href:oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.thumbnail_width,
                height: oembed.thubnail_height
            });

        }

        return links;
    },

    getData: function(url, oembedError, cb, options, whitelistRecord) {
        // Handle private videos, ex. https://vimeo.com/243312327
        cb (null,
            oembedError == 403 ? {
                message: 'Because of its privacy settings, this video cannot be embedded.'
            } : null
        );

    },

    tests: [{
        feed: "http://vimeo.com/channels/staffpicks/videos/rss"
    },
        "https://vimeo.com/65836516",
        "https://vimeo.com/141567420",
        {
            skipMixins: ["oembed-description"],
            skipMethods: ["getData"]
        }
    ]
};