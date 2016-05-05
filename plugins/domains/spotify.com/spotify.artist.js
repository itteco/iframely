var cheerio = require('cheerio');

module.exports = {

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    re: /https?:\/\/(?:open|play).spotify.com\/artist\/(.*)/,

    provides: 'spotify_data',

    getMeta: function (spotify_data, oembed) {
        var description;

        if (spotify_data) {
          description = [
            spotify_data.name + ' is an artist on Spotify',
            'Genre: ' + (spotify_data.genres.length === 0 ? 'Unclassified' : spotify_data.genres.join(', ')),
            'Followers: ' + spotify_data.followers.total
          ].join('\n');
        }

        return {
            site: 'Spotify',
            title: spotify_data.name,
            description: description || oembed.description
        }
    },

    getData: function (urlMatch, request, cb) {
        request({
            uri: "https://api.spotify.com/v1/artists/" + urlMatch[1],
            json: true,
            prepareResult: function(error, response, body, cb) {

                if (error) {
                    return cb(error);
                }

                if (body.message) {
                    return cb(body.message);
                }

                cb(null, {
                    spotify_data: body
                });
            }
        }, cb);
    },

    tests: [
    ]
};
