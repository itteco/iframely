const sysUtils = require('../../../../logging');
const utils = require('../../../utils');

module.exports = function(result, decode, uri) {

    var ld = result["ld-json"];
    delete result["ld-json"];

    if (ld) {

        var ldParsed;

        if (!(ld instanceof Array)) {
            ld = [ld];
        }

        const addObject = function(obj) {
            var id = obj && obj['@type'];
            if (id) {

                if (!ldParsed) {
                    ldParsed = {};
                }
                ldParsed[id] = obj;
            }            
        };

        for(var i = 0; i < ld.length; i++) {
            try {
                var str = ld[i];
                var obj = utils.parseJSONSource(str, decode);

                if (obj instanceof Array) {
                    for(var j = 0; j < obj.length; j++) {
                        addObject(obj[j]);
                    }
                } else {
                    addObject(obj);
                }
                
            } catch (ex) {

                sysUtils.log('   -- Error parsing ld-json', uri, ex.message);

            }
        }

        if (ldParsed) {      
            return ldParsed;
        }
    }    
};

module.exports.notPlugin = true;