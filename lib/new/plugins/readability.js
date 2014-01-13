var Readability = require('readabilitySAX').Readability;

module.exports = {

    getData: function(uri, htmlparser, cb) {

        var readability = new Readability({
            pageURL: uri
        });

        htmlparser.addHandler(readability);

        htmlparser.response.on('onerror', cb);

        htmlparser.response.on('end', function() {

            for (
                var skipLevel = 1;
                readability._getCandidateNode().info.textLength < 250 && skipLevel < 4;
                skipLevel++
                ) {

                readability.setSkipLevel(skipLevel);
                htmlparser.restartFor(readability);
            }

            cb(null, {
                readability: readability
            });
        });
    }

};