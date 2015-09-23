var jQuery = require("jquery");

// API reference:
// https://firefox-marketplace-api.readthedocs.org/en/latest/topics/apps.html

module.exports = {

    re: /^https?:\/\/marketplace\.firefox\.com\/(?:api\/v1\/(?:apps|fireplace)\/)?app\/([-_%\.a-z0-9]+)/i,

    getData: function (urlMatch, request, cb) {
        var infoUri = "https://marketplace.firefox.com/api/v1/fireplace/app/"+urlMatch[1]+"/";

        request({
            uri: infoUri,
            qs: {
                format: 'JSON'
            },
            json: true,
            prepareResult: function(error, b, data, cb) {

                if (error) {
                    return cb(error);
                }

                if (data.app_type) {

                    cb(null, {
                        firefox_marketplace_data: data
                    });
                }
                else {
                    cb(infoUri + (data.reason ? " says "+data.reason : " returned no data"));
                }
            }
        }, cb);
    },

    getMeta: function (firefox_marketplace_data) {
        return {
            title:            firefox_marketplace_data.name,
            date:             firefox_marketplace_data.created,
            author:           firefox_marketplace_data.current_version.developer_name,
            description:      jQuery('<div>'+firefox_marketplace_data.description+'</div>').text(),
            canonical:        "https://marketplace.firefox.com/app/"+firefox_marketplace_data.slug
            /*,
            support_url:      firefox_marketplace_data.support_url,
            homepage:         firefox_marketplace_data.homepage,
            ratings_count:    firefox_marketplace_data.ratings.count,
            ratings_average:  firefox_marketplace_data.ratings.average,
            weekly_downloads: firefox_marketplace_data.weekly_downloads
            */
        };
    },

    getLinks: function(firefox_marketplace_data) {
        var links = [];
        var key;
        for (key in firefox_marketplace_data.icons) {
            var icon_size = parseInt(key,10);
            links.push({
                href:   firefox_marketplace_data.icons[key],
                type:   CONFIG.T.image_png,
                rel:    CONFIG.R.icon,
                width:  icon_size,
                height: icon_size
            });
        }

        firefox_marketplace_data.previews.forEach(function (preview) {
            links.push({
                href:  preview.image_url,
                type:  preview.filetype || CONFIG.T.image_png,
                rel:   CONFIG.R.image,
                title: preview.caption
            });
            
            links.push({
                href:  preview.thumbnail_url,
                type:  CONFIG.T.image_png,
                rel:   CONFIG.R.thumbnail,
                title: preview.caption
            });
        });

        var img = firefox_marketplace_data.previews && firefox_marketplace_data.previews.length && firefox_marketplace_data.previews[0].image_url;

        links.push({
            type:  CONFIG.T.text_html,
            rel:   [CONFIG.R.thumbnail, CONFIG.R.inline],
            html:
                (img ? '<p><img src="' + img + '"></p>' : '') +
                    '<p>' + firefox_marketplace_data.description + (firefox_marketplace_data.current_version.release_notes ?
                    '</p>\n<h3>Release Notes</h3>\n<p>' + firefox_marketplace_data.current_version.release_notes + '</p>' :
                    '</p>')
        });

        return links;
    },

    tests: [
        "https://marketplace.firefox.com/app/pasjanssolitaire?src=all-popular",
        "https://marketplace.firefox.com/app/wikipedia?src=all-popular",
        "https://marketplace.firefox.com/app/soundcloud?src=all-popular",
        {
            noFeeds: true
        }
    ]
};
