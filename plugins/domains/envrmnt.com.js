module.exports = {
    re: [
        /^https?:\/\/(?:cloud-)?www\.envrmnt\.com\/embed\/v1\/#\/video\/([\w\-]+)\?([\w\-]+)$/i
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


    getMeta: function (urlMatch) {
        return {
            videoId: urlMatch[1]
        }
    },

    getLinks: function(urlMatch) {
        var fullUrl = urlMatch[0];
        var videoId = urlMatch[1];
        var userUUID = urlMatch[2];

        var scriptURL = "http://fe-www.envrmnt.com/lib/ext-embed-v1.js";
        var wrapperCSS = "width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;";
        var iframeSrc = "http://www.envrmnt.com/embed/v1/#/video/"+videoId;
        var iframeCss = "width: 100%; height: 100%; position: absolute;";

        var html = '<script async src="'+scriptURL+'"></script>'+
                   '<div style="'+wrapperCSS+'">'+
                   '<div><iframe id="envrmnt_'+videoId+'" data-envrmnt-id="'+videoId+'" data-vrplayer '+
                   'src="'+iframeSrc+'" frameborder="0" allowfullscreen '+
                   'style="'+iframeCss+'"></iframe></div>'+
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
