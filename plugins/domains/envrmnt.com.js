module.exports = {
    re: [
        /^https?:\/\/(?:cloud-)?www\.envrmnt\.com\/share\/\?share=(?:[\w\-]+)\/([\w\-]+)\/?$/i,
        /^https?:\/\/(?:cloud-)?www\.envrmnt\.com\/#\/video\/([\w\-]+)\/?$/i
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
        var videoId = urlMatch[1];
        var src = "http://cloud-www.envrmnt.com/embed/#/video/"+videoId;
        var html = '<script async src="http://cloud-www.envrmnt.com/scripts/embed_v1.js"></script><div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe id="envrmnt_'+videoId+'" data-envrmnt-id="'+videoId+'" src="'+src+'" frameborder="0" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>';

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
