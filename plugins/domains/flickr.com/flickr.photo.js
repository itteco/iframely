module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.\-]+)\/(\d+).*?$/i,

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-license",
        "oembed-site",
        "domain-icon",
        "og-description"
    ],

    getLink: function(oembed, options) {

        var result =  [{
            href: oembed.thumbnail_url,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: oembed.thumbnail_width,
            height: oembed.thumbnail_height 
        }];

        if (oembed.type === 'photo') {
            result.push ({
                href: oembed.url,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail],
                type: CONFIG.T.image_jpeg,
                width: oembed.width,
                height: oembed.height
            });
        }


        var html = oembed.html;

        var opts = {
            header: options.getRequestOptions('flickr.header', /data-header=\"true\"/i.test(html)),
            footer: options.getRequestOptions('flickr.footer', /data-footer=\"true\"/i.test(html)),
            context: options.getRequestOptions('flickr.context', /data-context=\"true\"/i.test(html))
        };

        var key; // thanks jslint
        for (key in opts) {
            html = html.replace(new RegExp('\\s?data\\-' + key + '="(true|false)"'), '');
            if (opts[key]) {
                html = html.replace('data-flickr-embed="true"', 'data-flickr-embed="true" data-' + key + '="true"');
            }
        }


        result.push({
            html: html.replace(/width=\"\d+\" height=\"\d+\" alt/, 'width="100%" alt'),
            rel: (oembed.type === 'photo' ? [CONFIG.R.image] : [CONFIG.R.player, CONFIG.R.slideshow]).concat([CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5]),
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width / oembed.height,
            options: {
                header: {
                    label: 'Show user header',
                    value: opts.header
                },
                footer: {
                    label: 'Show description footer',
                    value: opts.footer
                },
                context: {
                    label: 'Show context slideshow',
                    value: opts.context
                }
            }
        });

        return result;
    },

    tests: [{
        feed: "http://api.flickr.com/services/feeds/photos_public.gne"
    },
        "http://www.flickr.com/photos/jup3nep/8243797061/?f=hp",
        "https://www.flickr.com/photos/marshal-banana/23869537421",
        "http://www.flickr.com/photos/gonzai/6027481335/in/photostream/",
        {
            skipMixins: [
                "oembed-title",
                "oembed-author",
                "oembed-license"
            ]
        }
    ]
};