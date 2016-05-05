var cheerio = require('cheerio');

module.exports = {

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    re: /https?:\/\/(?:open|play).spotify.com\/album\/(.*)/,

    provides: 'spotify_data',


    getMeta: function (spotify_data) {
        var releaseDate = new Date(spotify_data.release_date).getFullYear();
        releaseDate = !releaseDate ? '' : '(' + releaseDate + ')';

        return {
            site: 'Spotify',
            title: spotify_data.name,
            description: [
                spotify_data.name,
                releaseDate,
                'by',
                spotify_data.artists[0].name,
                'contains',
                spotify_data.tracks.items.length,
                'tracks.'
            ].join(' ')
        }
    },

    getData: function (urlMatch, request, cb) {
        request({
            uri: "https://api.spotify.com/v1/albums/" + urlMatch[1],
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
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi",
        "https://open.spotify.com/album/3N5MQ6jJk5P0bXpsMh4biJ",
        "https://play.spotify.com/album/3xqv5Al4TjgG9daEWZplIy",
        "https://play.spotify.com/album/65GHnO5PcfuXUADdyUPL70"
    ]
};
