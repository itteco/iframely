var cheerio = require('cheerio');

module.exports = {

    getLink: function(spotify_data) {

        var images = spotify_data.images || spotify_data.album.images;

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

    tests: [{
        noFeeds: true
    },
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi"
    ]
};
