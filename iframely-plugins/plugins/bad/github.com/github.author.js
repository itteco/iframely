module.exports = {

    re: /^https:\/\/github\.com\/(?!\b(?:site|security|about|blog|explore|contact|edu)\b)([^\/]+)$/i,

    getLinks: function(urlMatch, request, cb) {

        var apiUri = 'https://api.github.com/users/' + urlMatch[1];

        request({
            uri: apiUri,
            json: true
        }, function(error, response, userData) {

            if (error) {
                return cb(error);
            }

            var title = userData.name || userData.login;

            var links = [{
                title: title,
                type: 'application/javascript',
                template_context: {
                    userId: userData.login
                },
                dependencies: [
                    "css/github.author.min.css",
                    "js/jquery.github.author.min.js"
                ]
            }];

            if (userData.avatar_url) {
                links.push({
                    title: title,
                    href: userData.avatar_url,
                    type: 'image'
                });
            }

            cb(null, links);
        });
    },

    tests: [{
        page: "https://github.com/repositories",
        selector: ".repolist h3 a",
        getUrl: function(url) {
            var m = url.match(/^https:\/\/github\.com\/(?!\b(?:site|security|about|blog|explore|contact|edu)\b)([^\/]+)/i);
            if (m) {
                return m[0];
            }
        }
    },
        "https://github.com/cloudhead/"
    ]

};