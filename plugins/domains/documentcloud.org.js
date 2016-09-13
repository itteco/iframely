module.exports = {

    mixins: [
        "favicon",
        "oembed-site",
        "html-title"
    ],

    getLink: function(oembed, whitelistRecord) {

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
        if (whitelistRecord.isAllowed('oembed.rich', "summary")) {
            rels.push(CONFIG.R.summary);
        }
        rels.push ("allow"); // otherwise, rich->players get denied by oembed:video whitelist record

        var widget = {
            rel: rels,
            type: CONFIG.T.text_html
        };

        // allow encoded entities if they start from $lt; and end with &gt;
        var html = oembed.html5 || oembed.html;
        if (/^&lt;.*&gt;$/i.test(html)) {
            html = entities.decodeHTML(html);
        }

        widget.html = html; // will render in an iframe, unless "inline" is in rels

        if (whitelistRecord.isAllowed('oembed.rich', "inline")) {
            // Output exact HTML from oEmbed
            widget.html = html;
        }

        if (widget.html && whitelistRecord.isAllowed('oembed.rich', "ssl")) {
            // For pure HTML, the only way to detect SSL is to take it from Whitelist.
            widget.rel.push (CONFIG.R.ssl);
        }

        widget['aspect-ratio'] = 1;

        return widget;
    },

    tests: [
        'https://www.documentcloud.org/documents/73991-day-three-documents',
        {
            noFeeds: true
        }
    ]
};