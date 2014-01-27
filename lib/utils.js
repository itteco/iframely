exports.createTimer = function() {

    var timer = new Date().getTime();

    return function() {
        return new Date().getTime() - timer;
    };
};

var disposeObject = exports.disposeObject = function(o) {

    if (o) {

        if (o && o.hasOwnProperty && (
                   o.hasOwnProperty('plugins')
                || o.hasOwnProperty('whitelistRecord')
                || o.hasOwnProperty('whitelist'))) {
            delete o.plugins;
            delete o.whitelistRecord;
            delete o.whitelist;
        }

        if (o instanceof Array) {

            for(var i = 0; i < o.length; i++) {

                disposeObject(o[i]);

                o[i] = null;
            }

            o.length = 0;

        } else if (typeof o === "object") {

            for(var key in o) {
                if (o.hasOwnProperty(key)) {
                    disposeObject(o[key]);
                    o[key] = null;
                    delete o[key];
                }
            }

        }
    }
};