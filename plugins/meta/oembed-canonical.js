module.exports = {

    getMeta: function(oembed) {
        if (oembed.type != "photo") {
            return {
                canonical: oembed.url
            };
        }
    }
};
