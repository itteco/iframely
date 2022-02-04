export default {

    re: [
        /^https?:\/\/giphy\.com\/(?:gifs|stickers)\/(?:[a-zA-Z0-9_-]+\-)?([a-z0-9\-]+)/i,
        /^https?:\/\/giphy\.com\/(?:videos|clips)\/(?:[a-zA-Z0-9_-]+\-)?([a-zA-Z0-9]+)(?:\?.+)?/i
    ],

    mixins: [
        "canonical",
        "author",
        "oembed-site",
        "oembed-title",
        "keywords",
        "twitter-description",
        "domain-icon"
    ],

    getLinks: function(url, urlMatch, oembed, twitter, og, options) {

        var links = [];
        var isVid =  /\/(videos|clips)\//i.test(url);

        if (twitter.player) {
            links.push({
                href: (twitter.player.value || twitter.player).replace(/\/twitter\/iframe$/, ''),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5, CONFIG.R.gifv],
                "aspect-ratio": twitter.player.width / twitter.player.height
            });
        // Vidoes don't have Twitter player as of June 16, 2020 and as of Feb 1, 2021
        } else if (isVid && og.video && og.video.width && og.video.height) {
            links.push({
                href: `https://giphy.com/embed/${urlMatch[1]}/video`,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.gifv, CONFIG.R.autoplay],
                "aspect-ratio": og.video.width / og.video.height
            });            
        }

        var video = og.video;

        if (video && video.length > 1) {
            video = video[video.length -1];
        }

        if (video && (/\.mp4/.test(video.url) || video.type === CONFIG.T.video_mp4) && video.width && video.height) {
            links.push({
                href: video.url.replace(/^http:\/\//i, 'https://'),
                type: CONFIG.T.video_mp4,
                rel: [CONFIG.R.player, CONFIG.R.html5, isVid ? CONFIG.R.og : CONFIG.R.gifv],
                "aspect-ratio": video.width / video.height
            });
        }

        if (oembed.type == 'photo' && !isVid) {
            links.push({
                href: oembed.image || oembed.url,
                type: CONFIG.T.image_gif,
                rel: CONFIG.R.image,
                width: oembed.width,
                height: oembed.height
            });
        }

        var thumbnail = twitter.image && (twitter.image.src || twitter.image.url); 

        if (thumbnail && oembed.width && oembed.height && (oembed.width / oembed.height < 1.7 || oembed.width / oembed.height > 1.9)) {
            // fix resized thumbnail 
            // from https://media.giphy.com/media/.../giphy-facebook_s.jpg?t=1
            // to https://media3.giphy.com/media/.../giphy_s.gif

            thumbnail = thumbnail.replace(/\/giphy\-facebook_s\.jpg$/, '/giphy_s.gif');
        }

        links.push({
            href: thumbnail,
            type: CONFIG.T.image, // keep it here, otherwise thumbnail may come up with GIF MIME type
            rel: CONFIG.R.thumbnail,
            width: oembed.width,
            height: oembed.height
        });        

        return links;
    },

    getData: function (og, cb) {
        return cb (/^Private GIF$/i.test(og.title) 
            ? {
                responseStatusCode: 403,
                message: 'Sorry, the owner has set this GIF to private.'
            } 
            : null)
    },

    tests: [{
        skipMixins: ["oembed-canonical"]
    }, {
        skipMethods: ["getData"]
    },
        "http://giphy.com/gifs/art-artists-on-tumblr-design-uRmDTQDgYxSzS",
        "http://giphy.com/gifs/idk-shrug-shrugging-aXSLMy6fDsI4E",
        "https://giphy.com/gifs/nfl-super-bowl-nfl-sb-U7zS2FJTC8xclBzGVu",
        "https://giphy.com/videos/kehlani-open-passionate-kBMPSpmc4vbIc3h7Zo",
        "https://giphy.com/gifs/dancing-happy-seinfeld-BlVnrxJgTGsUw", // this one was broken and excluded via `!twitter.image.url`
        "https://giphy.com/stickers/cindysuenkeys-26AHtOSUIDsTJO7cs",
        "https://giphy.com/clips/LAS73aYc2HuOBn5w70"
    ]
};