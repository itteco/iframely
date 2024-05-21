export default {

    re: [
        /^https?:\/\/archive\.org\/details\/([^\/]+)\/?\??/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function(og) {
        return {
            title: og.title && og.title.replace(/\s?:\s?Free\sDownload.+$/i, '')
        }
    },

    getLink: function(url, twitter, utils, options, cb) {

        if (twitter.card === 'player' && twitter.player) {

            var playerHref = (twitter.player.stream && twitter.player.stream.value) || twitter.player.value || twitter.player;
            var hrefMatch = playerHref.match(/^https?:\/\/archive\.org\/(?:embed|download)\/([^\/]+)\/?\??/i); 

            if (hrefMatch) {

                var player = {
                    href: 'https://archive.org/embed/' + hrefMatch[1],
                    accept: CONFIG.T.text_html,
                    rel: CONFIG.R.player
                };

                if (/\.(mp3|wma|wav|flac)$/i.test(playerHref)) {
                    player.height = 40;
                    player["max-width"] = 776;
                    player.autoplay = 'autoplay=1';
                }


                if (/\.(mp4|avi|mov|mpeg)$/i.test(playerHref)) {
                    player["aspect-ratio"] = twitter.player.width / twitter.player.height;
                    player.autoplay = 'autoplay=1';
                }

                if (/playlist/i.test(playerHref)) {
                    player.height = 250;
                    player["max-width"] = 776;
                }

                cb(null, player);
            } else {
                cb(null, null);
            }

        } else if ((twitter.card === 'player' && !twitter.player && twitter.image 
            && /^https?:\/\/archive\.org\/(?:details|embed|download|stream)\/([^\/]+)\/?\??/i.test(url))
            // photos don't work yet, but here's how to check that it's a photo:
            || (twitter.card === 'summary_large_image' && twitter.image && !/\/services\/img\//i.test(twitter.image))
            ) {
            

                // need to know image sizes
                var img = twitter.image;
                var links = [];
                var urlMatch = url.match(/^https?:\/\/archive\.org\/(?:details|embed|download|stream)\/([^\/]+)\/?\??/i);
                var isPhoto = twitter.card === 'summary_large_image' && twitter.image && !/\/services\/img\//i.test(twitter.image);

                utils.getImageMetadata(img, options, function(error, data) {

                    if (error || data.error || !(data.width && data.height)) {
                        return cb('Error getting Archive.org image:' +  (error || data.error));
                    }

                    links.push({
                        href: img,
                        type: CONFIG.T.image, 
                        rel: isPhoto ? [CONFIG.R.image, CONFIG.R.thumbnail] : CONFIG.R.thumbnail,
                        width: data.width,
                        height: data.height
                    });

                    if (urlMatch) {
                        if (isPhoto) {
                            links.push({
                                href: `https://archive.org/embed/${urlMatch[1]}`,
                                type: CONFIG.T.text_html,
                                rel: CONFIG.R.image,
                                "aspect-ratio": data.width / data.height,
                            });

                        } else {
                            links.push({
                                href: `https://archive.org/stream/${urlMatch[1]}?ui=embed`,
                                type: CONFIG.T.text_html,
                                rel: CONFIG.R.reader,
                                "aspect-ratio": 2 * data.width / data.height,
                                "padding-bottom": 40 + 15
                            });
                        }
                    }

                    return cb(null, links);

                });

        } else {
            return cb(null, null);
        }

    },

    tests: [
        // player
        "https://archive.org/details/Podcast8.23GoethesIronicMephistopheles1700s1800s",
        "https://archive.org/details/um2000-09-01.shnf",
        "https://archive.org/details/MLKDream",
        "https://archive.org/details/movie-time-jodorowskys-dune-2013",

        "https://archive.org/details/TheInternetArchivistsFinalCutBoostedSound",
        "https://archive.org/details/ChronoTrigger_456",
        "https://archive.org/details/YourFami1948",
        // reader
        "https://archive.org/details/IbnIshaq-SiratuRasulAllah-translatorA.Guillaume",
        "https://archive.org/details/galaxymagazine-1950-10",
        "https://archive.org/details/wessextales0000thom_z1o2/page/n9/mode/2up",
        // image
        "https://archive.org/details/mma_selfportrait_with_a_straw_hat_obverse_the_potato_peeler_436532",
        "https://archive.org/details/propix.SIL08-09434-a",
        "https://archive.org/details/harley-davidson-x440-crash-guard"
    ]
};