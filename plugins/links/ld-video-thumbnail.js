module.exports = {

    getLink: function(ld) {

        if (ld.videoobject && ld.videoobject.thumbnail) {

            var src = ld.videoobject.thumbnail.contenturl;
            if (src) {
                return {
                    href: src,
                    type: CONFIG.T.image,
                    rel: CONFIG.R.thumbnail
                    /** Skip sizes to check the image */
                };
            }

        }
    }

};