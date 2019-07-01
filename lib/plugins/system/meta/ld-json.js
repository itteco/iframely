const sysUtils = require('../../../../logging');
const utils = require('../../../utils');

module.exports = function(result, decode) {

    var ld = result["ld-json"];
    delete result["ld-json"];

    if (ld) {

        var ldParsed;

        if (!(ld instanceof Array)) {
            ld = [ld];
        }

        for(var i = 0; i < ld.length; i++) {
            try {
                var str = ld[i];
                var obj = utils.parseJSONSource(str, decode);
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
            return ldParsed;
        }
    }    
};

module.exports.notPlugin = true;