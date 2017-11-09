module.exports = {

    re: [
        /^https?:\/\/(?:m|new\.)?vk\.com\/video/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-video-duration",
        "og-site",
        "og-title",
        "favicon"
    ],

    getLink: function(url, meta, cb) {

        var video_url = (meta.og && meta.og.video && meta.og.video.url) || url; //for direct links to VK videos

        var oid = video_url.match(/oid=([\-_a-zA-Z0-9]+)/);
        var vid = video_url.match(/vid=([\-_a-zA-Z0-9]+)/) || video_url.match(/\Wid=([\-_a-zA-Z0-9]+)/);
        var hash = video_url.match(/embed\_hash=([\-_a-zA-Z0-9]+)/) || video_url.match(/hash=([\-_a-zA-Z0-9]+)/);

        if (!oid || !vid || !hash) {
            return cb({
                message: "Is that a video from external source? Try to find direct link to it inside the player."                
            });
        }

        var aspect = (meta.og && meta.og.video && meta.og.video.height) ? meta.og.video.width / meta.og.video.height : 4/3;

        cb(null, {
            href: "https://vk.com/video_ext.php?oid=" + oid[1] + "&id=" + vid[1] + "&hash=" + hash[1] + "&hd=1",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": aspect,
            autoplay: "autoplay=1"
        });
    },

    tests: [
        "https://vk.com/video246045358_456239211",
        "https://vk.com/videos-130381004?z=video-130381004_456239909%2Fclub130381004%2Fpl_-130381004_-2",
        "https://vk.com/mil?z=video-133441491_456239767%2F3da2a83ffebdae2580%2Fpl_wall_-133441491"
    ]    
};