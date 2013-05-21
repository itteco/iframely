module.exports = {

    re: /^https:\/\/github\.com\/(?!\b(?:site|security|about|blog|explore|contact|edu)\b)([^\/\?#]+\/[^\/\?#]+)$/i,

    getLinks: function(urlMatch, request, cb) {

        var apiUri = 'https://api.github.com/repos/' + urlMatch[1];

        request({
            uri: apiUri,
            json: true
        }, function(error, response, repoData) {

            if (error) {
                return cb(error);
            }

            var title = repoData.full_name;

            var links = [{
                title: title,
                type: 'application/javascript',
                template: 'github.repo',
                template_context: {
                    repoId: repoData.full_name
                },
                dependencies: [
                    "css/github.repo.min.css",
                    "js/jquery.github.repo.min.js"
                ]
            }];

            if (repoData.owner && repoData.owner.avatar_url) {
                links.push({
                    title: title,
                    href: repoData.owner.avatar_url,
                    type: 'image'
                });
            }

            cb(null, links);
        });
    },

    tests: [{
        page: "https://github.com/repositories",
        selector: ".repolist h3 a"
    },
        "https://github.com/cloudhead/less.js"
    ]
};