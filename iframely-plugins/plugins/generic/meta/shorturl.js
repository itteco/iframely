module.exports = {
    getMeta: function(meta) {

        var s = meta.shorturl;

        if (s instanceof Array) {
            s = s[0];
        }

        return {
            shorturl: s.url || s
        };
    }
};