var cheerio = require('cheerio');

module.exports = {

    getLink: function(oembed, whitelistRecord) {


        if (!(oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich'))) {
            return;
        }

        var rels = [CONFIG.R.oembed];

        if (whitelistRecord.isAllowed('oembed.rich', "reader")) {
            rels.push(CONFIG.R.reader);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "player")) {
            rels.push(CONFIG.R.player);
        }
        if (rels.length == 1) {
            rels.push(CONFIG.R.app);
        }
        // if (whitelistRecord.isAllowed('oembed.rich', "responsive")) rels.push("responsive");
        if (whitelistRecord.isAllowed('oembed.rich', "inline")) {
            rels.push(CONFIG.R.inline);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "html5")) {
            rels.push(CONFIG.R.html5);
        }
        rels.push ("allow"); // otherwise, rich->players get denied by oembed:video whitelist record


        var widget = {
            rel: rels,
            type: CONFIG.T.text_html
        };

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        // if embed code contains <iframe>, return src
        if ($iframe.length == 1 && !whitelistRecord.isAllowed('oembed.rich', "inline")) {

            widget.href = $iframe.attr('src');

            if (whitelistRecord.isAllowed('oembed.rich', 'ssl')) {
                widget.href = widget.href.replace(/^http:\/\//i, '//');
            }
        
        } else { 
            widget.html = oembed.html || oembed.html5; // will render in an iframe, unless "inline" is in rels
        }


        if (whitelistRecord.isAllowed('oembed.rich', "inline")) {
            // Output exact HTML from oEmbed
            widget.html = oembed.html5 || oembed.html;
        }

        if (widget.html && whitelistRecord.isAllowed('oembed.rich', "ssl")) {
            // For pure HTML, the only way to detect SSL is to take it from Whitelist.
            widget.rel.push (CONFIG.R.ssl);
        }

        if (whitelistRecord.isAllowed('oembed.rich', 'responsive') && oembed.width && oembed.height) {

            // Fixed height case: <iframe width="100%" height="675"
            if ($iframe.length == 1 && $iframe.attr('width') === '100%' && (!$iframe.attr('height') || $iframe.attr('height').match(/\d+/))) {

                widget.height = oembed.height || $iframe.attr('height');

            } else {
                widget['aspect-ratio'] = oembed.width / oembed.height;
            }
        } else {
            widget.width = oembed.width;
            widget.height = oembed.height
        }

        return widget;

    },


    // tests are only applicable with the whitelist, otherwise will throw errors on Test UI
    /*
    tests: [
        "http://talent.adweek.com/gallery/ASTON-MARTIN-Piece-of-Art/3043295", //Behance oEmbed rich
        "http://www.behance.net/gallery/REACH/8080889", // Behance default, with '100%' height
        "http://list.ly/list/303-alternatives-to-twitter-bootstrap-html5-css3-responsive-framework" //oembed rich reader
    ]
    */

};