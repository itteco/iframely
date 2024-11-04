import cheerio from 'cheerio';
import * as querystring from 'querystring';

export default {

    re: [
        /^https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\/?\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube\.com\/live\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\/?\?v=([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube-nocookie\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i
    ],

    mixins: ["domain-icon"],

    provides: 'youtube_video_gdata',

    getData: function(urlMatch, request, log, options, cb) {

        var api_key = options.getProviderOptions('youtube.api_key');

        if (!api_key) {
            return cb (new Error ("No youtube.api_key configured"));
        }

        var parts = options.getProviderOptions('youtube.parts') || [
            "id",
            "snippet",
            "statistics",
            "contentDetails",
            "player",
            "status"
        ];

        var statsUri = "https://www.googleapis.com/youtube/v3/videos?part=" + parts.join("%2C") + "&key=" + api_key + "&id=" + urlMatch[1];

        request({
            uri: statsUri,
            cache_key: "youtube:gdata:" + urlMatch[1],
            json: true,
            allowCache: function(error, response, data) {

                var errorDomain = 
                    data 
                    && data.error
                    && data.error.errors
                    && data.error.errors[0]
                    && data.error.errors[0].domain;

                var errorCode = 
                    data 
                    && data.error
                    && data.error.code;

                var usageLimitsError = 
                    errorDomain === 'youtube.quota'
                    || errorDomain === 'usageLimits';

                var serverError = errorCode && errorCode >= 500 && errorCode < 600;

                return !usageLimitsError && !serverError;
            },
            prepareResult: function(error, response, data, cb) {
                if (error) {
                    return cb(error);
                }

                if (data?.items?.length > 0) {
                    var entry = data.items[0];

                    var duration = 0;
                    var durationStr = entry.contentDetails?.duration;
                    if (durationStr) {
                        var m = durationStr.match(/(\d+)S/);
                        if (m) {
                            duration += parseInt(m[1]);
                        }
                        m = durationStr.match(/(\d+)M/);
                        if (m) {
                            duration += parseInt(m[1]) * 60;
                        }
                        m = durationStr.match(/(\d+)H/);
                        if (m) {
                            duration += parseInt(m[1]) * 60 * 60;
                        }
                    }

                    var gdata = {
                        id: urlMatch[1],
                        title: entry.snippet?.title,
                        uploaded: entry.snippet?.publishedAt,
                        uploader: entry.snippet?.channelTitle,
                        channelId: entry.snippet?.channelId,
                        description: entry.snippet?.description,
                        likeCount: entry.statistics?.likeCount,
                        dislikeCount: entry.statistics?.dislikeCount,
                        viewCount: entry.statistics?.viewCount,

                        hd: entry.contentDetails?.definition === "hd",
                        playerHtml: entry.player?.embedHtml,
                        embeddable: entry.status ? entry.status.embeddable : true,
                        uploadStatus: entry.status?.uploadStatus,
                        status: entry.status,
                        ytRating: entry.contentDetails?.contentRating?.ytRating,
                        isShort: /\/shorts\//i.test(urlMatch[0])
                    };

                    if (entry.snippet?.thumbnails) {
                        gdata.thumbnails = entry.snippet.thumbnails;
                    }

                    if (duration) {
                        gdata.duration = duration;
                    }

                    if (gdata.uploadStatus === "rejected") {
                        cb({
                            responseStatusCode: 410,
                            message: "The video has been removed. Reason: " + (entry.status?.rejectionReason || 'not given')
                        });
                    } else {
                        cb(null, {
                            youtube_video_gdata: gdata
                        });
                    }

                } else if (data && data.items && data.items.length == 0 || data && data.error && data.error.code == 404) {
                    cb({responseStatusCode: 404});
                } else {
                    log('YoutTube fallback for ' + urlMatch[1], data);
                    cb(null); // silence error for fallback to generic providers. data.error.code == 429 - too many requests; 400 - probably API key is invalid
                }
            }
        }, cb);
    },

    getMeta: function(youtube_video_gdata) {
        return {
            title: youtube_video_gdata.title,
            date: youtube_video_gdata.uploaded,
            author: youtube_video_gdata.uploader,
            category: youtube_video_gdata.category,
            description: youtube_video_gdata.description,
            duration: youtube_video_gdata.duration,
            likes: youtube_video_gdata.likeCount,
            dislikes: youtube_video_gdata.dislikeCount,
            views: youtube_video_gdata.viewCount,
            warning: youtube_video_gdata.ytRating === 'ytAgeRestricted' ? 'age': null,
            site: "YouTube",
            canonical: "https://www.youtube.com/watch?v=" + youtube_video_gdata.id,
            author_url: "https://www.youtube.com/" + (youtube_video_gdata.channelId  ? "channel/" + youtube_video_gdata.channelId : "user/" + youtube_video_gdata.uploader)
        };
    },

    getLinks: function(url, youtube_video_gdata, options) {

        var params = querystring.parse(options.getProviderOptions('youtube.get_params', '').replace(/^\?/, ''));

        /** Extract ?t=12m15s, ?t=123, ?start=123, ?stop=123, ?end=123
        */
        try {
            var start = url.match(/(?:t|start)=(\d+(?:m\d+)?(?:s)?m?)/i);
            var end = url.match(/(?:stop|end)=(\d+(?:m\d+)?(?:s)?m?)/i);

            start = options.getRequestOptions('_start', (start && start[1]) || '');
            end = options.getRequestOptions('_end', (end && end[1]) || '');

            var parseTime = function (t) {
                if (typeof t === 'array') {
                    t = t[1];
                }
                if (typeof t === "string" && !/^\d+$/.test(t)) {
                    var m = t.match(/(\d+)m/);
                    var s = t.match(/(\d+)s/);
                    var time = 0;
                    if (m) {
                        time = 60 * m[1];
                    }
                    if (s) {
                        time += 1 * s[1];
                    }
                    return time;
                } else {
                    return parseInt(t);
                }
            };

            if (start && start !== '') {
                params.start = parseTime(start);
            }

            if (end && end !== '') {
                params.end = parseTime(end);
            }
        } catch (ex) {/* and ignore */}
        // End of time extractions

        if (options.getProviderOptions('locale', false)) {
            params.hl = options.getProviderOptions('locale', 'en-US').replace('_', '-');
        }

        // https://developers.google.com/youtube/player_parameters#cc_load_policy
        var cc_load_policy = options.getRequestOptions('youtube.cc_load_policy', params.cc_load_policy);
        if (cc_load_policy) {
            params.cc_load_policy = 1;
        } else if (params.cc_load_policy) {
            delete params.cc_load_policy;
        }

        // https://developers.google.com/youtube/player_parameters#controls
        var controls = options.getRequestOptions('youtube.controls', params.controls);
        if (controls == 0) {
            params.controls = 0;
        } else if (params.controls) {
            delete params.controls;
        }

        // https://developers.google.com/youtube/player_parameters#loop
        var loop = options.getRequestOptions('youtube.loop', params.loop);
        if (loop) {
            params.loop = 1;
            // 'To loop a single video, set the loop parameter value to 1 and set the playlist parameter value to the same video ID'
            if (!params.playlist) {
                params.playlist = youtube_video_gdata.id;
            }
        } else if (params.loop) {
            delete params.loop;
        }        

        // Support for direct links to YouTube clip embeds
        if (/\/embed\/[^\?]+\?.*clip=.+clipt=.+/i.test(url)) {
            var uri = url;
            if (/&amp;/i.test(uri)) {
                uri = url.replace(/&amp;/g, '&');
            }

            var query = querystring.parse(uri.match(/\?(.+)$/)[1]);

            if (query.clip && query.clipt) {
                params.clip = query.clip;
                params.clipt = query.clipt;
            }
        }

        // Detect widescreen videos. YouTube API used to have issues with returing proper aspect-ratio.
        var widescreen = youtube_video_gdata.hd || (youtube_video_gdata.thumbnails && youtube_video_gdata.thumbnails.maxres != null);
        var rels = [CONFIG.R.player];

        if (youtube_video_gdata.playerHtml) { // maybe still widescreen. plus detect 'allow' from html
            var $container = cheerio('<div>');
            try {
                $container.html(youtube_video_gdata.playerHtml);
            } catch (ex) {}

            var $iframe = $container.find('iframe');

            if (!widescreen && $iframe.length == 1 && $iframe.attr('width') && $iframe.attr('height') && $iframe.attr('height') > 0) {
                widescreen =  $iframe.attr('width') / $iframe.attr('height') > 1.35;
            }
            if ($iframe.attr('allow')) {
                rels = rels.concat($iframe.attr('allow').replace(/autoplay;?\s?/ig, '').split(/\s?;\s?/g));
            }
        }
        // End of widescreen & allow check

        var links = [];
        var aspect = youtube_video_gdata.isShort ? 9 / 16 : (widescreen ? 16 / 9 : 4 / 3);

        if (youtube_video_gdata.embeddable && youtube_video_gdata.ytRating !== 'ytAgeRestricted') {

            var qs = querystring.stringify(params);
            if (qs !== '') {qs = '?' + qs}

            var domain = /^https?:\/\/www\.youtube-nocookie\.com\//i.test(url) || options.getProviderOptions('youtube.nocookie', false) ? 'youtube-nocookie' : 'youtube';

            links.push({
                href: 'https://www.' + domain + '.com/embed/' + youtube_video_gdata.id + qs,
                rel: rels,
                type: CONFIG.T.text_html,
                "aspect-ratio": aspect,
                autoplay: "autoplay=1",
                options: {
                    start: {
                        label: 'Start from',
                        value: '' + (params.start || ''),
                        placeholder: 'ex.: 11, 1m10s'
                    },
                    end: {
                        label: 'End on',
                        value: '' + (params.end || ''),
                        placeholder: 'ex.: 11, 1m10s'
                    },
                    cc_load_policy: {
                        label: 'Closed captions',
                        value: cc_load_policy ? true : false
                    }
                }
            }); 
        } else if (youtube_video_gdata.ytRating === 'ytAgeRestricted') {
            links.push({message: "This video is age-restricted and only available on YouTube"});
        } else {
            links.push({message: (youtube_video_gdata.uploader || "Uploader of this video") +  " disabled embedding on other sites."});
        }

        // thumbnails. Avoid black stripes
        youtube_video_gdata.thumbnails && Object.keys(youtube_video_gdata.thumbnails).forEach(function(def) {
            if ( youtube_video_gdata.thumbnails[def] 
                && youtube_video_gdata.thumbnails[def].width
                && youtube_video_gdata.thumbnails[def].height
                && Math.round(10 * youtube_video_gdata.thumbnails[def].width / youtube_video_gdata.thumbnails[def].height) == Math.round(10 * aspect)) {
                links.push({
                    href: youtube_video_gdata.thumbnails[def].url,
                    rel: CONFIG.R.thumbnail,
                    type: CONFIG.T.image_jpeg,
                    width: youtube_video_gdata.thumbnails[def].width, 
                    height: youtube_video_gdata.thumbnails[def].height
                });
            }
        });

        // But allow bigger image (with black stripes, sigh) for HD w/o maxresdefault to avoid 'tiny-only' thumbnail
        if (youtube_video_gdata.embeddable && widescreen && youtube_video_gdata.thumbnails && !youtube_video_gdata.thumbnails.maxres && (youtube_video_gdata.thumbnails.standard || youtube_video_gdata.thumbnails.high)) {
            var thumbnail = youtube_video_gdata.thumbnails.standard || youtube_video_gdata.thumbnails.high;
            links.push({
                href: thumbnail.url,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width: thumbnail.width, 
                height: thumbnail.height
            });
        }

        return links;
    },

    tests: [{
        noFeeds: true
    },
        "http://www.youtube.com/watch?v=etDRmrB9Css", // 4:3
        "https://www.youtube.com/embed/mDFBTdToRmw?rel=0",
        "https://www.youtube.com/embed/yJpJ8REjvqo?si=-2PKj71d6RhnnCFU&amp;clip=UgkxvYwD1omSQWCDuoWYo6hHJjQzcLGbJqYi&amp;clipt=EPjgJhjg4ig" // sic! with &amp; - as the code is manually copied from YouTube
        // embeds disabled - https://www.youtube.com/watch?v=e58FeKOgsU8
    ]
};
