var jquery = require('jquery');

module.exports = {

    getLink: function(oembed, whitelistRecord) {


        if (!(oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich'))) {
            return;
        }

        var inline = whitelistRecord.isAllowed('oembed.rich', "reader") || whitelistRecord.isAllowed('oembed.rich', "inline");

        var widget = {
            type: CONFIG.T.text_html,
            rel:[CONFIG.R.oembed, CONFIG.R.reader]
        };

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            widget.href = $iframe.attr('src');
        
        } else { 
            widget.html = oembed.html || oembed.html5; // will render in an iframe

            if (inline) {
                widget.rel.push(CONFIG.R.inline);
            }
        }


        if (whitelistRecord.isAllowed('oembed.rich', 'responsive')) {
            if (oembed.width && oembed.height) {
                widget['aspect-ratio'] = oembed.width / oembed.height;
            }
        } else {
            widget.width = oembed.width;
            widget.height = oembed.height
        }

        return widget;

    },


    // tests are only applicable with the whitelist, otherwise will throw errors on Test UI
    tests: [
        "http://talent.adweek.com/gallery/ASTON-MARTIN-Piece-of-Art/3043295", //Behance oEmbed rich
        "http://www.behance.net/gallery/REACH/8080889", // Behance default, with '100%' height
        "http://list.ly/list/303-alternatives-to-twitter-bootstrap-html5-css3-responsive-framework" //oembed rich reader
    ]

};