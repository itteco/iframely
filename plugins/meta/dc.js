export default {

    getMeta: function(meta) {

        function getAttr(attr) {

            var root = meta.dc || meta.dcterms, key;
            if (root && root[attr]) {
                for(key in root) {
                    if (key == attr) {
                        return root[key];
                    }
                }
            }

            for(key in meta) {
                var bits = key.split('.');
                if (bits.length > 1) {
                    var b0 = bits[0];
                    var b1 = bits.slice(1).join('.');
                    if ((b0 == "dcterms" || b0 == "dc") && b1 == attr) {
                        return meta[key];
                    }
                }
            }
        }

        return {
            title: getAttr("title"),
            description: getAttr("description"),
            author: getAttr("creator"),
            date: getAttr("date") || getAttr("date.issued") || getAttr("created") || getAttr("modified")
        };
    }
};
