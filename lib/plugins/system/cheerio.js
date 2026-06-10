import * as cheerio from 'cheerio';
import htmlparser2 from "htmlparser2";
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
                cheerio: cheerio.load(dom, {
                    // Routes $.html() through dom-serializer instead of renderWithParse5.
                    // parse5's serializer hard-codes escaping of U+00A0 → &nbsp; and ignores decodeEntities.
                    _useHtmlParser2: true,
                    // Fixes decoding html characters like &nbsp; to UTF-8, we have own decoders.
                    decodeEntities: false
                })
            });
        });

        htmlparser.addHandler(domHandler);
    }

};
