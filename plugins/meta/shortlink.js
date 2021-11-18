export default {
    getMeta: function(meta) {

        var s = meta.shorturl || meta.short_url || meta.shortlink;

        if (s instanceof Array) {
            s = s[0];
        }

        if (!s) {
            return;
        }

        return {
            shortlink: s.href || s
        };
    }
};