module.exports = {

    getMeta: function(oembed) {
        return {
            license: oembed.license,
            license_url: oembed.license_url
        };
    }
};