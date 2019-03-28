module.exports = {

    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/(?:pg\/)?([a-zA-Z0-9\.\-]+)\/?(?:about|photos|videos|events)?\/?(?:\?[a-zA-Z0-9\-_]+=[a-zA-Z0-9\-_]+)?$/i
    ],

    getMeta: function(oembed, meta, urlMatch) {

        if (meta.og && meta.og.title && meta['html-title'] && !/security check required/i.test(meta['html-title'])) {

            return {
                title: meta.og.title,
                description: meta.og.description
            }
        } else if (oembed.html) {

            var title = oembed.html.match(/>([^<>]+)<\/a><\/blockquote>/i);
            title = title ? title[1] : urlMatch[2];

            return {
                title: title
            };
        }
    },    

    getLinks: function(oembed, meta, url, options) {

        var links = [];

        if (meta.og && meta.og.image) {
            links.push ({
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            });
        }
        // skip user profiles - they can not be embedded
        if ((meta.ld && meta.ld.organization && /blockquote/.test(oembed.html)) 
            || (meta.al && meta.al.android && meta.al.android.url && !/\/profile\//.test(meta.al.android.url) && /blockquote/.test(oembed.html))
            || (meta['html-title'] && /security check required/i.test(meta['html-title']) && /blockquote/.test(oembed.html)) ) {

            var html = oembed.html;

            html = options.getRequestOptions('facebook.show_posts', false)
                ? html.replace(/data\-show\-posts=\"(?:false|0)?\"/i, 'data-show-posts="true"')
                : html.replace(/data\-show\-posts=\"(true|1)\"/i, 'data-show-posts="false"');

            html = options.getRequestOptions('facebook.show_facepile', false)
                ? html.replace(/data\-show\-facepile=\"(?:false|0)?\"/i, 'data-show-facepile="true"')
                : html.replace(/data\-show\-facepile=\"(true|1)\"/i, 'data-show-facepile="false"');

            html = options.getRequestOptions('facebook.small_header', false)
                ? html.replace(/data\-small\-header=\"(?:false|0)?\"/i, 'data-small-header="true"')
                : html.replace(/data\-small\-header=\"(true|1)\"/i, 'data-small-header="false"');


            links.push ({
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
                html: html,
                options: {
                    show_posts: {
                        label: 'Show recent posts',
                        value: /data\-show\-posts="(true|1)"/i.test(html)
                    },
                    show_facepile: {
                        label: 'Show profile photos when friends like this',
                        value: /data\-show\-facepile="(true|1)"/i.test(html)
                    },
                    small_header: {
                        label: 'Use the small header instead',
                        value: /data\-small\-header="(true|1)"/i.test(html)
                    }
                },
                "max-width": oembed.width
            });
        } else {
            links.push ({
                message: "Facebook profile pages of individual users are not embeddable."
            });
        }

        return links;
    },

    getData: function(oembed, options) {
        
        if (oembed.html && /blockquote/.test(oembed.html)) {
            options.followHTTPRedirect = true; // avoid security re-directs of URLs if any
        }
    },

    tests: [
        "https://www.facebook.com/facebook",
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        "https://www.facebook.com/pg/RhulFencing/about/",
        {
            noFeeds: true,
            skipMethods: ['getData']
        }
    ]
};