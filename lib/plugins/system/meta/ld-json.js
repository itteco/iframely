var sysUtils = require('../../../../logging');

module.exports = function(result) {

    var ld = result["ld-json"];

    var ldParsed;

    if (ld) {

        if (!(ld instanceof Array)) {
            ld = [ld];
        }

        for(var i = 0; i < ld.length; i++) {
            try {
                var str = ld[i];
                var obj = JSON.parse(str);
                var id = obj && obj['@type'];
                if (id) {

                    if (!ldParsed) {
                        ldParsed = {};
                    }

                    ldParsed[id] = obj;

                }
            } catch (ex) {

                sysUtils.log('   -- Error parsing ld-json', ex.message);

            }
        }

        if (ldParsed) {
            result.ld = ldParsed;
        }
    }

    delete result["ld-json"];
};

module.exports.notPlugin = true;