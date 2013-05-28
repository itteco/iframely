module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/photo\.php/i,

    mixins: [
        "favicon"
    ],

    getLink: function($selector) {

        var preview = $selector('img#fbPhotoImage').attr('src');
        var title = $selector('.hasCaption').text().trim();

        if (preview) {
            return {
                title: title,
                href: preview,
                type: CONFIG.R.image,
                rel: CONFIG.R.image
            };
        }
    }
};