import * as querystring from 'querystring';

export default {

    re: [
        /^https:\/\/vimeo\.com(?:\/channels?\/\w+)?\/\d+/i, // Includes private reviews like /video/123/ABC.
        /^https?:\/\/player\.vimeo\.com\/video\/(\d+)/i
    ],

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
        var iframe = oembed.getIframe();

        var params = querystring.parse(options.getProviderOptions('vimeo.get_params', '').replace(/^\?/, ''));

        if (options.getProviderOptions('players.showinfo', false)) {
            params.title = 1;
            params.byline = 1;
        }

        // Captions support:
        // https://vimeo.zendesk.com/hc/en-us/articles/360027818211-Enabling-Captions-and-Subtitles-in-Embeds-by-Default
        var texttrack = options.getRequestOptions('vimeo.texttrack');
        if (texttrack && /\w{2}(?:\-\W{2})?/i.test(texttrack)) {
            params.texttrack = texttrack;
        } else {
            texttrack = '';
        }

        var links = [];

        if (oembed.thumbnail_url || !options.getProviderOptions('vimeo.disable_private', false)) {
            links.push({
                href: iframe.replaceQuerystring(params),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.thumbnail_width < oembed.thumnmail_height ? oembed.thumbnail_width / oembed.thubnail_height : oembed.width / oembed.height, // ex. portrait https://vimeo.com/216098214
                autoplay: "autoplay=1",
                options: {
                    texttrack: {
                        value: texttrack,
                        label: 'Text language (ignored if no captions)',
                        placeholder: 'Two letters: en, fr, es, de...'
                    }
                }
            });
        }

        // Let's try and add bigger image if needed, but check that it's value.
        // No need to add everywhere: some thumbnails are ok, like https://vimeo.com/183776089, but some are not - http://vimeo.com/62092214.
        if (options.getProviderOptions('images.loadSize') !== false && /\d+_\d{2,3}x\d{2,3}(?:\.jpg)?$/.test(oembed.thumbnail_url)) {
            links.push({
                href:oembed.thumbnail_url.replace(/_\d+x\d+((?:\.jpg)?)$/, '$1'),
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


    tests: [{
        feed: "http://vimeo.com/channels/staffpicks/videos/rss"
    },
        "https://vimeo.com/65836516",
        "https://vimeo.com/141567420",
        "https://vimeo.com/76979871", // captions
        {
            skipMixins: ["oembed-description"],
            skipMethods: ["getData"]
        }
    ]
};