module.exports = {

    getMeta: function(oembed) {
        return {
            canonical: oembed.url
        };
    }
};
