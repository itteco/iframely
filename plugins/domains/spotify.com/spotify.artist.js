var cheerio = require('cheerio');

module.exports = {

    highestPriority: true,

    mixins: [
        "oembed-site"
    ],

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    re: /https?:\/\/(?:open|play).spotify.com\/artist\/(.*)/,

    provides: 'spotify_data',

    _getCoverImages: function (images) {
        var coverImages = [];
        images.forEach(function (image){
          coverImages.push({
            href: image.url,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
          });
        });

        return coverImages;
    },

    getLink: function(spotify_data, oembed) {

        var favicon = {
          href: "http://d2c87l0yth4zbw.cloudfront.net/i/_global/favicon.png",
          type: CONFIG.T.image,
          rel: CONFIG.R.icon
        };

        var thumbnail = this._getCoverImages(spotify_data.images || spotify_data.album.images);

        var player;

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            player = {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                 "aspect-ratio":  100 / 115 // hardcode here as otherwise there's blank space beneath the player
            }
        }

        return thumbnail.concat([
          favicon,
          player
        ]);

    },

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
        "https://play.spotify.com/user/1241058074/playlist/44CgBWWr6nlpy7bdZS8ZmN",
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/user/cgwest23/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi"
    ]
};
