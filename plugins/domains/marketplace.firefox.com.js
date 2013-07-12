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
            json: true
        }, function(error, b, data) {

            if (error) {
                return cb(error);
            }

            if (data.app_type) {
                cb(null, {
                    firefox_marketplace_data: data,
                    html_for_readability:
                        '<p>' + data.description + (data.current_version.release_notes ?
                        '</p>\n<h3>Release Notes</h3>\n<p>' + data.current_version.release_notes + '</p>' :
                        '</p>'),
                    ignore_readability_error: true
                });
            }
            else {
                cb(infoUri + (data.reason ? " says "+data.reason : " returned no data"));
            }
        });
    },

    getMeta: function (firefox_marketplace_data) {
        return {
            title:            firefox_marketplace_data.name,
            date:             firefox_marketplace_data.created,
            author:           firefox_marketplace_data.current_version.developer_name,
            description:      jQuery('<div>'+firefox_marketplace_data.description+'</div>').text(),
            canonical:        "https://marketplace.firefox.com/app/"+firefox_marketplace_data.slug,
            support_url:      firefox_marketplace_data.support_url,
            homepage:         firefox_marketplace_data.homepage,
            ratings_count:    firefox_marketplace_data.ratings.count,
            ratings_average:  firefox_marketplace_data.ratings.average,
            weekly_downloads: firefox_marketplace_data.weekly_downloads
        };
    },

    getLinks: function(firefox_marketplace_data) {
        var links = [];

        for (var key in firefox_marketplace_data.icons) {
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

        return links;
    }
};
