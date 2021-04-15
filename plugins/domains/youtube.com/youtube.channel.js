const sysUtils = require('../../../logging')

module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?youtube\.com\/(channel)\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/(?:www\.)?youtube\.com\/(user|c)\/([a-zA-Z0-9_-]+)/i
    ],

    mixins: ["domain-icon"],

    provides: 'youtube_channel_gdata',

    // https://developers.google.com/youtube/v3/docs/channels/list
    getData: function(url, urlMatch, request, options, cb) {

        var api_key = options.getProviderOptions('youtube.api_key');

        if (!api_key) {
            return cb (new Error ("No youtube.api_key configured"));
        }

        var parts = options.getProviderOptions('youtube.channel_parts') || [
            "id",
            "localizations",
            "snippet",
            "status",
            "topicDetails",
        ];

        var statsUri = `https://youtube.googleapis.com/youtube/v3/channels?part=${parts.join("%2C")}&key=${api_key}&`;
        statsUri += (urlMatch[1] === 'channel' ? "id=" : "forUsername=")+ urlMatch[2];

        if (options.getProviderOptions('locale', false)) {
            statsUri += `&hl=${options.getProviderOptions('locale', 'en').replace(/(?:\-|_)\w+$/, '')}`;
        }

        request({
            uri: statsUri,
            cache_key: `youtube:${urlMatch[1]}}:${urlMatch[2]}`,
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

                if (data.items && data.items.length > 0) {

                    var entry = data.items[0];

                    var gdata = {
                        id: urlMatch[1],
                        title: entry.snippet && (entry.snippet.localized && entry.snippet.localized.title || entry.snippet.title),
                        description: entry.snippet && (entry.snippet.localized && entry.snippet.localized.description || entry.snippet.description),
                        status: entry.status && entry.status.privacyStatus,
                        thumbnails: entry.snippet && entry.snippet.thumbnails
                    };

                    cb(null, {
                        youtube_channel_gdata: gdata
                    });

                } else if (data.items && data.items.length == 0 || data.error && data.error.code == 404) {
                    cb({responseStatusCode: 404});
                } else {
                    /* Can be `data.pageInfo && data.pageInfo.totalResults === 0` 
                     * as if no channel found, but it actually exists.
                     * Ex.: https://www.youtube.com/c/Figmadesign
                     */
                    sysUtils.log('YoutTube channel fallback for ' + url , data);
                    cb({
                        message: 'YouTube channel not found via data API...'
                        // But no response code. Let's fallback to default parsers
                        // was: responseStatusCode: 408
                    });
                }
            }
        }, cb);
    },

    getMeta: function(youtube_channel_gdata) {
        return {
            title: youtube_channel_gdata.title,
            description: youtube_channel_gdata.description,
            site: "YouTube"
        };
    },

    getLinks: function(url, youtube_channel_gdata, options) {

        var links = [];

        if (youtube_channel_gdata.thumbnails) {

            for (const [res, img] of Object.entries(youtube_channel_gdata.thumbnails)) {
                links.push({
                    href: img.url,
                    type: CONFIG.T.image, 
                    rel: [CONFIG.R.thumbnail],
                    width: img.width,
                    height: img.height
                });     
            }
        }

        return links;
    },

    tests: [{
        noFeeds: true
    },
        "https://www.youtube.com/channel/UCSZ69a-0I1RRdNssyttBFcA",
        "https://www.youtube.com/user/kvn/",
        "https://www.youtube.com/c/SpaceX",
        "https://www.youtube.com/c/Figmadesign"
    ]
};
