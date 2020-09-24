module.exports = {

    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/[^\/]+\/?(?:about|photos|videos|events|timeline|photos_stream)?\/?(?:\?[^\/\?]+)?$/i,
        /^https?:\/\/(www|m)\.facebook\.com\/(?:pg|pages)\//i
    ],

    mixins: [
        "domain-icon",
        "*"
        // "fb-error" // Otherwise the HTTP redirect won't work for URLs like http://www.facebook.com/133065016766815_4376785445728063
    ],

    getLinks: function(oembed, meta, url, options) {

        /* Legacy oEmbed endpoint returned OK result for both companies and users,
         * however, HTML for user profiles did not work.
         * Some checks below are legacy ones to skip user profiles. Perhaps, no longer needed as of Oct 24, 2020.
         */
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


            return {
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
            };        
        }
    },

    getData: function(oembedError, meta) {
        if (meta.ld && meta.ld.person) {
            return {
                message: "Facebook profile pages of individual users are not embeddable."
            };
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