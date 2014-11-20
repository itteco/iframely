exports.notPlugin = true;

var NO_INDEX_TAGS = ['noindex'];

exports.checkRobots = function(noindexHeader, cb) {
    if (noindexHeader) {
        var i;
        for(i = 0; i < NO_INDEX_TAGS.length; i++) {
            if (noindexHeader.indexOf(NO_INDEX_TAGS[i]) > -1) {
                cb({
                    responseStatusCode: 403
                });
                return true;
            }
        }
    }
};