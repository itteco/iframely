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
        "https://open.spotify.com/track/4by34YzNiEFRESAnBXo7x4",
        "https://open.spotify.com/track/2qZ36jzyP1u29KaeuMmRZx",
        "http://open.spotify.com/track/7ldU6Vh9bPCbKW2zHE65dg",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi",
        "https://open.spotify.com/album/3N5MQ6jJk5P0bXpsMh4biJ",
        "https://play.spotify.com/artist/586uxXMyD5ObPuzjtrzO1Q"
    ]
};
