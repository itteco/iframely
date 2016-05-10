var cheerio = require('cheerio');

module.exports = {

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    re: /https?:\/\/(?:open|play).spotify.com\/(?:embed\/)?track\/(.*)/,

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

    tests: [{
        noFeeds: true
    },
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "https://open.spotify.com/track/4by34YzNiEFRESAnBXo7x4",
        "https://open.spotify.com/track/2qZ36jzyP1u29KaeuMmRZx",
        "http://open.spotify.com/track/7ldU6Vh9bPCbKW2zHE65dg",
        "https://play.spotify.com/track/2vN0b6d2ogn72kL75EmN3v",
        "https://play.spotify.com/track/34zWZOSpU2V1ab0PiZCcv4"
    ]
};
