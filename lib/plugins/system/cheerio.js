import * as cheerio from 'cheerio';
import * as htmlparser2 from "htmlparser2";
var DomHandler = htmlparser2.DomHandler;

export default {

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