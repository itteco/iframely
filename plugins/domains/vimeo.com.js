const querystring = require('querystring');
const _ = require('underscore');

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

        var params = querystring.parse(options.getProviderOptions('vimeo.get_params', '').replace(/^\?/, ''));

        if (options.getProviderOptions('players.showinfo', false)) {
            params.title = 1;
            params.byline = 1;
        }

        var qs = querystring.stringify(params);
        if (qs !== '') {qs = '?' + qs}        

        var links = [{
            href: "https://player.vimeo.com/video/" + oembed.video_id + qs,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": oembed.width / oembed.height < 1 ? 16/9: oembed.width / oembed.height, // ex. https://vimeo.com/216098214
            autoplay: "autoplay=1"
        }];

        // let's try and add bigger image if needed, but check that it's value
        // no need to add everywhere: some thumbnails are ok, like https://vimeo.com/183776089, but some are not - http://vimeo.com/62092214
        if (options.getProviderOptions('images.loadSize') !== false && /\d+_\d{2,3}x\d{2,3}\.jpg$/.test(oembed.thumbnail_url)) {

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