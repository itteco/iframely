export default {

    re: /^(https?:\/\/jsfiddle.net\/(?:\w+\/)?\w+\/)\/?(?:[^\/]+)?$/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, meta) {
        if (meta.author && (
            meta.ld && meta.ld.code 
            || meta.copyright)
            ) { // E.g. skip /terms/ and blobs
            var src = urlMatch[1].replace(/^http:\/\//i, 'https://') + "embed/"; 
            return {
                html: `<script async src="${src}"></script>`,
                type: CONFIG.T.text_html, // iFrame embed option returns x-frame-options for validators
                rel: [CONFIG.R.app, CONFIG.R.ssl]
            };
        }
    },

    tests: [
        "https://jsfiddle.net/pborreli/pJgyu/",
        "https://jsfiddle.net/timwienk/LgJsN/",
        "https://jsfiddle.net/j78s3dak/",
        {
            noFeeds: true
        }
    ]
};