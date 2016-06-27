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

        var scriptURL = "http://cloud-www.envrmnt.com/scripts/embed_v1.js";
        var wrapperCSS = "width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;";
        var iframeSrc = "http://cloud-www.envrmnt.com/embed/#/video/"+videoId;
        var iframeCss = "width: 100%; height: 100%; position: absolute;";
        var fullscreenCSS = ".envrmnt--fullscreen {top: 0; right: 0; bottom: 0; left: 0; height: 100%; width: 100%; position: fixed; z-index: 9999999;}";

        var html = '<script async src="'+scriptURL+'"></script>'+
                   '<style>'+fullscreenCSS+'</style>'+
                   '<div style="'+wrapperCSS+'">'+
                   '<iframe id="envrmnt_'+videoId+'" data-envrmnt-id="'+videoId+'" '+
                   'src="'+iframeSrc+'" frameborder="0" allowfullscreen '+
                   'style="'+iframeCss+'"></iframe>'+
                   '</div>';

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
