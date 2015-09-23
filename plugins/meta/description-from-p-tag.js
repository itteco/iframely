var decodeHTML5 = require('entities').decodeHTML5;
var utils = require('../../lib/utils');
var getCharset = utils.getCharset;
var encodeText = utils.encodeText;

module.exports = {

    getMeta: function(cheerio, meta) {
        // Get the text from the first <p> tag that's not in a header
        var description;
        cheerio("body p").each(function() {
            var $p = cheerio(this);

            if (!$p.parents("noscript, header,#header,[role='banner']").length) {
                description = decodeHTML5(encodeText(meta.charset, cheerio(this).text()));
                return false;
            }
        });

        if (description) {
            return {
                description: description
            }
        }
    },

    lowestPriority: true
};
