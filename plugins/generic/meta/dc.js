module.exports = {

    useAlways: true,

    getMeta: function(meta) {

        function getAttr(attr) {

            var root = meta.DC || meta.dc || meta.DCTERMS || meta.dcterms;
            if (root && root[attr]) {
                return root[attr];
            }

            for(var key in meta) {
                var bits = key.split('.');
                if (bits.length > 1) {
                    var b0 = bits[0].toLowerCase();
                    var b1 = bits.slice(1).join('.').toLowerCase();
                    if ((b0 == "dcterms" || b[0] == "dc") && b1 == attr) {
                        return meta[key];
                    }
                }
            }
        }

        return {
            title: getAttr("title"),
            description: getAttr("description"),
            author: getAttr("creator"),
            date: getAttr("date") || getAttr("date.issued")
        };
    }
};