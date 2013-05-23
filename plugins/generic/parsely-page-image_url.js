module.exports = {

    getLink: function(parsely_page) {
        return {
            href: parsely_page.image_url,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        };
    }
};