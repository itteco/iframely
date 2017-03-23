var URL = require('url');

module.exports = {

    provides: '__ooyalaPlayer',

    getData: function(meta, whitelistRecord) {

        // do not process if there is a whitelist record for this domain
        if (!whitelistRecord.isDefault) {return;}
        
        var video_src = (meta.twitter && meta.twitter.player && meta.twitter.player.value) || (meta.og && meta.og.video && meta.og.video.url);

        if (!video_src || video_src instanceof Array || !/^https?:\/\/(?:www\.)?(?:player\.)?ooyala\.com\//i.test(video_src)) {
            return;
        }

        var url = URL.parse(video_src, true);
        var query = url.query;
        
        var urlMatch = video_src.match(/^https?:\/\/(?:www\.)?(?:player\.)?ooyala\.com\/(?:stable\/[^\.])?(?:tframe\.html|iframe\.html|player\.swf)\?(?:embedCode|ec)=([_a-zA-Z0-9\-]+)/);

        if (query.embedCode || query.ec || query.embedcode) {
            return {
                __ooyalaPlayer: {
                    embedCode: query.embedCode || query.ec || query.embedcode,
                    pbid: query.pbid || query.player,
                    width: (meta.twitter && meta.twitter.player && meta.twitter.player.width) || (meta.og && meta.og.video && meta.og.video.width),
                    height: (meta.twitter && meta.twitter.player && meta.twitter.player.height) || (meta.og && meta.og.video && meta.og.video.height)
                }
            };
        } 
    },

    getLink: function(__ooyalaPlayer, url, request, cb) {

        request({
            uri: "http://player.ooyala.com/nuplayer?embedCode=" + __ooyalaPlayer.embedCode,
            // Ooyala is really slow - allow all players from a domain after the first check
            cache_key: 'ooyala:domain:' + url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase(),
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

                    var aspect = __ooyalaPlayer.width && __ooyalaPlayer.height && (__ooyalaPlayer.width / __ooyalaPlayer.height < 1.5) ? 4 / 3 : 16/9;
                    var rel = [CONFIG.R.player];
                    var href = 'https://player.ooyala.com/';
                    var type = CONFIG.T.text_html;

                    if (__ooyalaPlayer.pbid) {
                        href = href + 'tframe.html?platform=html5-priority&embedCode=' + __ooyalaPlayer.embedCode + '&keepEmbedCode=true' + '&pbid=' + __ooyalaPlayer.pbid;
                        rel.push(CONFIG.R.html5);
                    } else {
                        href = href + 'player.swf?embedCode=' + __ooyalaPlayer.embedCode + '&keepEmbedCode=true';
                        type = CONFIG.T.flash; // there's a 302 re-direct at the moment so it returns as text/html
                    }

                    return cb(null, [{
                        href: href,
                        rel: rel,
                        type: type,
                        'aspect-ratio': aspect
                    }, {
                        href: type === CONFIG.T.text_html ? href + '&options[autoplay]=true' : href + '&autoplay=1',
                        rel: rel.concat(CONFIG.R.autoplay),
                        type: type,
                        'aspect-ratio': aspect
                    }]);
                }
            }
        }, cb);
    },

    tests: [
        "http://www.torontofc.ca/video/2015/06/24/bacardi-match-highlights-mtl-vs-tor-june-24-2014",
        "http://www.theverge.com/2013/8/5/4588634/moto-x-hands-on-review-video",
        "http://www.revolutionsoccer.net/post/2016/01/26/outside-box-1-entrance-physicals-and-first-day-back?autoplay=true",
        "http://www.vox.com/explains/2014/4/23/5643382/how-bitcoin-is-like-the-internet-in-the-80s",
        "http://www.polygon.com/2013/10/23/4947500/cooperatives-pokemon-x-and-y",
        "http://www.orlandocitysc.com/post/2016/05/16/barber-shop-darwin-cer-n?autoplay=true",
        "http://www.thisisinsider.com/cheesy-breakfast-potatoes-2016-5",
        "http://www.unotv.com/videoblogs/tecnologia/gadgets-tecnologia-apps/detalle/javier-matuk-20-enero-como-te-gustaria-mesas-pinball-futuro-986876/",
        "http://www.livescience.com/54668-spacex-lands-again-first-stage-on-droneship-despite-extreme-velocities-video.html",
        "http://matchcenter.mlssoccer.com/matchcenter/2016-09-10-philadelphia-union-vs-montreal-impact/details/video/88433"
    ]
};