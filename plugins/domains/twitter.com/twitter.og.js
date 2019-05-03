module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_og'],

    getData: function(__allow_twitter_og, meta) {

        return {
            twitter_og: meta.og ? meta.og : false
            // exclude proxy images, ex:
            // https://twitter.com/nfl/status/648185526034395137
        }
    }
};

// Twitter video disappeared silently as embedding option from Twitter docs
/*  og video code was:
        // enable video, but only if requested by config 
        if ((options.getProviderOptions("twitter") || options.getProviderOptions("twitter.status")).enable_video
            && twitter_og && twitter_og.video && twitter_og.video.url && twitter_og.video.width && twitter_og.video.height && twitter_og.image 
            && /^https?:\/\/pbs\.twimg\.com\/(?:media|amplify|ext_tw)/i.test(twitter_og.image.url || twitter_og.image.src || twitter_og.image) ) {            
            // exclude not embedable videos with proxy images, ex:
            // https://twitter.com/nfl/status/648185526034395137

            links.push({
                href: twitter_og.video.url.replace('?embed_source=facebook', ''),
                rel: [CONFIG.R.player, CONFIG.R.html5],
                accept: CONFIG.T.text_html, // let's check it
                'aspect-ratio': twitter_og.video.width / twitter_og.video.height
            });

        }
*/