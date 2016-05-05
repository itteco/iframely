var cheerio = require('cheerio');

module.exports = {

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    re: /https?:\/\/(?:open|play).spotify.com\/track\/(.*)/,

    provides: 'spotify_data',

    getMeta: function (spotify_data) {
        var releaseDate = new Date(spotify_data.album.released).getFullYear();
        releaseDate = !releaseDate ? '' : '(' + releaseDate + ')';
        return {
            site: 'Spotify',
            title: spotify_data.name,
            description: [
                'by',
                spotify_data.artists[0].name,
                '\non',
                spotify_data.album.name,
                releaseDate
            ].join(' ')
        }
    },

    getData: function (urlMatch, request, cb) {
        request({
            uri: "https://api.spotify.com/v1/tracks/" + urlMatch[1],
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
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
    ]
};
