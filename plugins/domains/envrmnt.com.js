console.log("envrmnt.com loaded");

module.exports = {
    re: [
        /^https?:\/\/(?:cloud-)?www\.envrmnt\.com\/share\/\?share=([\w\-]+)\/([\w\-]+)\/?$/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "video",
        "twitter-description",
        "media-detector",
        "og-site",
        "twitter-title"
    ],

    getLinks: function(urlMatch) {
        var fullUrl = urlMatch[0];
        var videoId = urlMatch[2];
        var playerId = urlMatch[1];
        var src = fullUrl;
        var html = "<iframe id='"+videoId+"' src='"+src+"'></iframe>";

        return [{
            type: CONFIG.T.text_html,
            rel: [
                CONFIG.R.player,
                CONFIG.R.inline,
                CONFIG.R.html5
            ],
            html: html
        }];
    }
};
