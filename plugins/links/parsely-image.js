export default {

    getLink: function(parsely) {
        return {
            href: parsely.image_url,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        };
    }
};