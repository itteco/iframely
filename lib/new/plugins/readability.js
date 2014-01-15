var Readability = require('readabilitySAX').Readability;

module.exports = {

    provides: 'self',

    getData: function(uri, htmlparser, cb) {

        var readability = new Readability({
            pageURL: uri
        });
        // Moved to top, because JSLINT error: Move 'var' declarations to the top of the function.
        var skipLevel;

        htmlparser.addHandler(readability);

        htmlparser.response.on('onerror', cb);

        function onEnd() {
            for (
                skipLevel = 1;
                readability._getCandidateNode().info.textLength < 250 && skipLevel < 4;
                skipLevel++
                ) {

                readability.setSkipLevel(skipLevel);
                htmlparser.restartFor(readability);
            }

            cb(null, {
                readability: readability
            });
        }

        htmlparser.response.on('end', onEnd);
    }

};