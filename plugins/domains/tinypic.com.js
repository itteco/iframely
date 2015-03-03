module.exports = {

    re: [
        /^https?:\/\/tinypic\.com\//i    // Exclude direct links to images
    ],

    mixins: [
        "image_src",
        "favicon",
        "html-title"
    ],

    getLink: function(meta) {

        var original = meta['image_src'];
        if (!original) {
            return;
        }

        original = original.replace('_th.', '.');

        return {
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        };
    },

    tests: [
        "http://tinypic.com/r/29z62bd/5",
        "http://tinypic.com/view.php?pic=29z62bd&s=5#.Uopal2TF3A4"
    ]
};