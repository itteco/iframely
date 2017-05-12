module.exports = function(result) {

    var ld = result["ld-json"];

    var ldParsed;

    if (ld) {

        if (!(ld instanceof Array)) {
            ld = [ld];
        }

        for(var i = 0; i < ld.length; i++) {
            try {
                var obj = JSON.parse(ld[i]);
                var id = obj['@type'];
                if (id) {

                    if (!ldParsed) {
                        ldParsed = {};
                    }

                    ldParsed[id] = obj;

                }
            } catch (ex) {}
        }

        if (ldParsed) {
            result.ld = ldParsed;
        }
    }

    delete result["ld-json"];
};

module.exports.notPlugin = true;