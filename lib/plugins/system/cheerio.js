var cheerio = require('cheerio').default;
var htmlparser2 = require("htmlparser2");
var DomHandler = htmlparser2.DomHandler;

module.exports = {

    provides: 'self',

    getData: function(htmlparser, cb) {

        var domHandler = new DomHandler(function(error, dom) {

            htmlparser.removeHandler(domHandler);

            if (error) {
                return cb(error);
            }

            cb(null, {
                cheerio: cheerio.load(dom)
            });
        });

        htmlparser.addHandler(domHandler);
    }

};