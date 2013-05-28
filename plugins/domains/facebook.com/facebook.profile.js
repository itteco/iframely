module.exports = {

    re: [
        /^https?:\/\/(?:(?:www|m)\.)?facebook\.com\/([^\/\?#]+)(?:\?|#|\/?$)/i,
        /^https?:\/\/www\.facebook\.com\/([^\/\?#]+)$/i
    ],

    getLink: function(urlMatch, request, cb) {

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
                rel: CONFIG.R.image
            }]);
        });
    },

    tests: "http://www.facebook.com/nazar.leush"
};