export default {

    re: /^https?:\/\/(?:tube|www)\.geogebra\.org\/material\/\w+\/id\/([a-zA-Z0-9]+)/i,

    // It's here mostly just to detect proper embed sizing.
    getLink: function(url, cheerio) {
        var $script = cheerio('script:contains("var parameters =")');

        if ($script.length === 1 && /({.+});/i.test($script.html())) {
            try {
                var params = JSON.parse ($script.html().match(/({.+});/i)[1]);

                if (params.width && params.height) {
                    return {
                        href: url,
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.oembed],
                        'aspect-ratio': params.width / params.height
                    }
                }
            } catch (ex) {} 
        } else {
            return {
                message: 'Make sure you publish the media before sharing..'
            }
        }
    },

    getData: function(__statusCode) {
        if (__statusCode === 403 || __statusCode === 401) {
            return {
                message: 'Make sure you publish the media before sharing.'
            }
        }
    },

    tests: [{skipMethods: ['getData']},
        "https://www.geogebra.org/material/iframe/id/rgZVk8bJ"
    ]
};