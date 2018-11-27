var URL = require('url');

module.exports = {

    provides: '__ooyalaPlayer',

    getData: function(video_src, meta, whitelistRecord) {

        if (!/^(?:https?:)?\/\/(?:www\.)?(?:player\.)?ooyala\.com\//i.test(video_src)) {
            return;
        }

        var url = URL.parse(video_src, true);
        var query = url.query;

        if (query.embedCode || query.ec || query.embedcode) {
            
            return {
                __ooyalaPlayer: {
                    video_src: video_src,
                    embedCode: query.embedCode || query.ec || query.embedcode,
                    pbid: query.pbid || query.player || query.playerBrandingId,
                    pcode: query.pcode || query.videoPcode,                    
                    width: (meta.twitter && meta.twitter.player && meta.twitter.player.width) || (meta.og && meta.og.video && meta.og.video.width),
                    height: (meta.twitter && meta.twitter.player && meta.twitter.player.height) || (meta.og && meta.og.video && meta.og.video.height)
                }
            };
        } 
    },

    getLink: function(__ooyalaPlayer, url, request, cb) {

        var opts = {
            uri: "http://player.ooyala.com/nuplayer?embedCode=" + __ooyalaPlayer.embedCode,
            // Ooyala is really slow - allow all players from a domain after the first check
            new_cache_key: 'ooyala:embed:' + __ooyalaPlayer.embedCode,
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
                    return cb(
                        "ooyala video isn't valid: " + __ooyalaPlayer.embedCode, 
                        {
                            message: "Ooyala video detected, but it isn't working properly."
                        });
                } else {

                    var aspect = __ooyalaPlayer.width && __ooyalaPlayer.height && (__ooyalaPlayer.width / __ooyalaPlayer.height < 1.5) ? 4 / 3 : 16/9;
                    var rel = [CONFIG.R.player, CONFIG.R.oembed]; // to bypass href=canonical validation
                    var href = 'https://player.ooyala.com/';
                    var type = CONFIG.T.text_html;

                    var where_hosted;

                    //v4
                    if (__ooyalaPlayer.video_src && /(?:https?:)?\/\/player\.ooyala\.com\/(.+\/)iframe\.html/i.test(__ooyalaPlayer.video_src) && __ooyalaPlayer.pbid && __ooyalaPlayer.pcode) {
                        // doc: http://help.ooyala.com/video-platform/concepts/pbv4_resources.html

                        where_hosted = __ooyalaPlayer.video_src.match(/^(?:https?:)?\/\/player\.ooyala\.com\/(.+)\/iframe\.html/i)[1];                         

                        href = href + where_hosted + '/'
                            + 'iframe.html?ec=' + __ooyalaPlayer.embedCode + '&pbid=' + __ooyalaPlayer.pbid + '&pcode=' + __ooyalaPlayer.pcode;

                        rel.push(CONFIG.R.html5);

                    //v3, 2
                    } else if (__ooyalaPlayer.pbid) {
                        href = href + 'tframe.html?platform=html5-priority&embedCode=' + __ooyalaPlayer.embedCode + '&keepEmbedCode=true' + '&pbid=' + __ooyalaPlayer.pbid;

                        if (__ooyalaPlayer['options[adSetTag]'] && '' !== __ooyalaPlayer['options[adSetTag]']) {
                            href += '&options[adSetTag]=' + __ooyalaPlayer['options[adSetTag]'];
                        }

                        rel.push(CONFIG.R.html5);

                    /* disable player.swf - we can not reliably detect if the video is valid or not */
                    } else {
                        href = null; // href + 'player.swf?embedCode=' + __ooyalaPlayer.embedCode + '&keepEmbedCode=true';
                        // type = CONFIG.T.flash; // there's a 302 re-direct at the moment so it returns as text/html
                    }

                    var player = null;
                    if (href) { // exclude player.swf
                        var player = {
                            href: href,
                            rel: rel,
                            type: type,
                            'aspect-ratio': aspect,
                            autoplay: type === CONFIG.T.text_html ? 'options[autoplay]=true' : 'autoplay=1'
                        };
                    }

                    return cb(null, player);
                }
            }
        };            

        if (/^https?:\/\/player.ooyala\.com\//i.test(url)) {
            delete opts['cache_key']; // let it validate each direct link to a vid individually
        }

        request(opts, cb);
    },

    tests: [
        "http://www.unotv.com/videoblogs/tecnologia/gadgets-tecnologia-apps/detalle/javier-matuk-20-enero-como-te-gustaria-mesas-pinball-futuro-986876/"
    ]
};