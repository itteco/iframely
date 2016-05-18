module.exports = {

    provides: '__ooyalaPlayer',

    getData: function(meta, whitelistRecord) {

        // do not process if there is a whitelist record for this domain
        if (!whitelistRecord.isDefault) {return;}
        
        var video_src = (meta.twitter && meta.twitter.player && meta.twitter.player.value) || (meta.og && meta.og.video && meta.og.video.url);

        if (!video_src || video_src instanceof Array || !/^https?:\/\/player\.ooyala\.com\/(?:tframe\.html|player\.swf)/i.test(video_src)) {
            return;
        }
        
        var urlMatch = video_src.match(/^https?:\/\/player\.ooyala\.com\/(?:tframe\.html|player\.swf)\?(?:embedCode|ec)=([_a-zA-Z0-9\-]+)/);

        if (urlMatch) {
            return {
                __ooyalaPlayer: {
                    embedCode: urlMatch[1],
                    pbid: /&pbid=/.test(video_src) ? video_src.match(/pbid=([_a-zA-Z0-9\-]+)/)[1] : null,
                    width: (meta.twitter && meta.twitter.player && meta.twitter.player.width) || (meta.og && meta.og.video && meta.og.video.width),
                    height: (meta.twitter && meta.twitter.player && meta.twitter.player.height) || (meta.og && meta.og.video && meta.og.video.height)
                }
            };
        } 
    },

    getLink: function(__ooyalaPlayer, request, cb) {

        request({
            uri: "http://player.ooyala.com/nuplayer?embedCode=" + __ooyalaPlayer.embedCode,
            method: 'HEAD',
            headers: {
                'Accept-Encoding': 'gzip, deflate, sdch', // this is required for head request to return content_length
                'Connection': 'close'
            },

            prepareResult: function(error, response, body, cb) {

                if (error) {
                    return cb(error);
                }

                if (response.statusCode !== 200 || !response.headers || !response.headers['content-length'] || response.headers['content-length'] < 1000) {
                    return cb("ooyala video isn't valid: " + __ooyalaPlayer.embedCode);
                } else {
                    return cb(null, {
                        href: "https://player.ooyala.com/tframe.html?embedCode=" + __ooyalaPlayer.embedCode + '&keepEmbedCode=true' 
                            + (__ooyalaPlayer.pbid ? '&pbid=' + __ooyalaPlayer.pbid : ''),
                        rel: [CONFIG.R.player, CONFIG.R.html5],
                        type: CONFIG.T.text_html,
                        "aspect-ratio": __ooyalaPlayer.width && __ooyalaPlayer.height ? __ooyalaPlayer.width / __ooyalaPlayer.height : CONFIG.DEFAULT_ASPECT_RATIO
                    });
                }
            }
        }, cb);
    }

    // gazzillion of examples. 
    // http://www.torontofc.ca/video/2015/06/24/bacardi-match-highlights-mtl-vs-tor-june-24-2014
    // http://www.theverge.com/2013/8/5/4588634/moto-x-hands-on-review-video
    // http://www.revolutionsoccer.net/post/2016/01/26/outside-box-1-entrance-physicals-and-first-day-back?autoplay=true
    // http://www.vox.com/explains/2014/4/23/5643382/how-bitcoin-is-like-the-internet-in-the-80s
    // http://www.polygon.com/2013/10/23/4947500/cooperatives-pokemon-x-and-y
    // http://www.orlandocitysc.com/post/2016/05/16/barber-shop-darwin-cer-n?autoplay=true
};