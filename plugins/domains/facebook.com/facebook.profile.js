module.exports = {

    // Re used in facebook.post.
    re: [
        /^https?:\/\/(?:(?:www|m)\.)?facebook\.com\/(?!photo)([^\/\?#]+)(?:\?|#|\/?$)/i,
        /^https?:\/\/www\.facebook\.com\/(?!photo)([^\/\?#]+)$/i
    ],

    getLink: function(url, request, cb) {

        var urlMatch;

        this.re.forEach(function(re) {
            urlMatch = urlMatch || url.match(re)
        });

        var graphUri = 'http://graph.facebook.com/' + urlMatch[1];

        request({
            uri: graphUri,
            json: true
        }, function(error, response, userData) {

            if (error){
                return callback(error, null);
            }

            cb(null, [{
                href: 'http://www.facebook.com/favicon.ico',
                type: CONFIG.T.image_icon,
                rel: CONFIG.R.icon
            }, {
                title: userData.name || userData.username,
                href: 'https://graph.facebook.com/'+userData.id+'/picture?width=600',
                type: CONFIG.R.image,
                rel: CONFIG.R.thumbnail
            }]);
        });
    },

    tests: [
        "https://www.facebook.com/logvynenko",
        {
            noFeeds: true
        }
    ]
};