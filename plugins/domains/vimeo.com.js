module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
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

        var params = options.getProviderOptions('vimeo.get_params', '');
        var autoplay = params + (params.indexOf ('?') > -1 ? "&": "?") + "autoplay=1";

        var links = [{
            href: "https://player.vimeo.com/video/" + oembed.video_id + params,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": oembed.width / oembed.height
        }, {
            href: "https://player.vimeo.com/video/" + oembed.video_id + autoplay,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            "aspect-ratio": oembed.width / oembed.height
        }];

        // let's try and add bigger image if needed, but check that it's value
        // no need to add everywhere: some thumbnails are ok, like https://vimeo.com/183776089, but some are not - http://vimeo.com/62092214
        if (options.getProviderOptions('images.loadSize') && /\d+_\d{2,3}x\d{2,3}\.jpg$/.test(oembed.thumbnail_url)) {

            links.push({
                href:oembed.thumbnail_url.replace(/_\d+x\d+\.jpg$/, '.jpg'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            });
        }

        return links;
    },

    tests: [{
        feed: "http://vimeo.com/channels/staffpicks/videos/rss"
    },
        "http://vimeo.com/65836516",
        {
            skipMixins: [
                "oembed-description"
            ]
        }
    ]
};