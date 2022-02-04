export const notPlugin = true;

var NO_INDEX_TAGS = ['noindex'];

export function checkRobots(noindexHeader, cb) {
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