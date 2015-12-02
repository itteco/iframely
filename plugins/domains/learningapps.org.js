module.exports = {

    re: /https?:\/\/learningapps.org\/([0-9]+)$/i,

    provides: 'learningapps',

    getData: function(urlMatch, request, cb) {

        request({
            uri: "http://learningapps.org/oembed.php?format=json&amp;url=http%3A%2F%2Flearningapps.org%2F" + urlMatch[1],
            json: true,
            limit: 1,
            timeout: 1000,
            prepareResult: function(error, response, body, cb) {

                if (error) {
                    return cb(error);
                }

                if (body.message) {
                    return cb(body.message);
                }
    
                cb(null, {
                    learningapps: body
                });
            }
        }, cb);
    },

    getLink: function(learningapps) {

        var $container = $('<div>');
        try {
            $container.html(learningapps.embedTag);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: CONFIG.R.image,
                "aspect-ratio": $iframe.attr('width') / $iframe.attr('height'),
                "max-width": $iframe.attr('width')
            };

        }
    },

    tests: [{
        noFeeds: true
    }]
};
