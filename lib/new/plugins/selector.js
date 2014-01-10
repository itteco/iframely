var cheerio = require('cheerio');
var htmlparser2 = require("htmlparser2");
var DomHandler = htmlparser2.DomHandler;

module.exports = {

    getData: function(htmlparser, cb) {

        var domHandler = new DomHandler(function(error, dom) {

            if (error) {
                cb(error);
            }

            cb(null, cheerio.load(dom));
        });

        htmlparser.addHandler(domHandler);
    }

};