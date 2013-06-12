module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/photo\.php/i,

    mixins: [
        "favicon"
    ],

    getLink: function($selector) {

        var $image = $selector('img#fbPhotoImage');

        if ($image.attr('width') == 1) {
            return;
        }

        var preview = $image.attr('src');
        var title = $selector('.hasCaption').text().trim();

        if (preview) {
            return {
                title: title,
                href: preview,
                type: CONFIG.R.image,
                rel: CONFIG.R.image
            };
        }
    },

    tests: [
        "http://www.facebook.com/photo.php?fbid=4253313542476&set=a.4253312782457.2159583.1574932468&type=1",
        {
            noFeeds: true
        }
    ]
};