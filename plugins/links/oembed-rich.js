module.exports = {

    getLink: function(oembed, whitelistRecord, url) {

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
        if (whitelistRecord.isAllowed('oembed.rich', "summary")) {
            rels.push(CONFIG.R.summary);
        }


        if (rels.length == 1) {
            rels.push(CONFIG.R.app);
        }


        if (whitelistRecord.isAllowed('oembed.rich', "audio")) {
            rels.push(CONFIG.R.audio);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "slideshow")) {
            rels.push(CONFIG.R.slideshow);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "playlist")) {
            rels.push(CONFIG.R.playlist);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "3d")) {
            rels.push(CONFIG.R['3d']);
        }


        if (whitelistRecord.isAllowed('oembed.rich', "inline")) {
            rels.push(CONFIG.R.inline);
        }
        if (whitelistRecord.isAllowed('oembed.rich', "html5")) {
            rels.push(CONFIG.R.html5);
        }
        rels.push ("allow"); // Otherwise, rich->players get denied by oembed:video whitelist record.

        var widget = {
            rel: rels,
            type: CONFIG.T.text_html
        };

        var iframe = oembed.getIframe();

        if (iframe && iframe.src && !whitelistRecord.isAllowed('oembed.rich', "inline")) {

            widget.href = iframe.src;

            if (whitelistRecord.isAllowed('oembed.rich', 'ssl')) {
                widget.href = widget.href.replace(/^http:\/\//i, '//');
            }
            // If iFrame is not SSL, 
            // But URL itself is same domain and IS ssl - fix the oEmbed ommission. 
            else if (url && /^http:\/\/([^\/]+)\//i.test(widget.href)
                && url.match('https://' + widget.href.match(/^http:\/\/([^\/]+)\//i[1]))
                ) {
                widget.href = widget.href.replace(/^http:\/\//i, '//');
            }

            if (iframe.scrolling === 'no') {
                widget.scrolling = 'no';
            }
        
        } else { 
            widget.html = oembed.html; // Will render in an iframe, unless "inline" is in rels.
        }

        if (widget.html && whitelistRecord.isAllowed('oembed.rich', "ssl")) {
            // For pure HTML, the only way to detect SSL is to take it from Whitelist.
            widget.rel.push (CONFIG.R.ssl);
        }

        if (whitelistRecord.isAllowed('oembed.rich', 'responsive') && oembed.width && oembed.height) {

            // Fixed height case: <iframe width="100%" height="675"...
            if (iframe.src && iframe.width === '100%' && (!iframe.height || Numnber.isInteger(iframe.height))) {
                widget.height = iframe.height || oembed.height;
            } else {
                widget['aspect-ratio'] = oembed.width / oembed.height;
            }
        } else if (whitelistRecord.isAllowed('oembed.rich', 'horizontal')) {
            widget.height = iframe.height || oembed.height;

            if (whitelistRecord.isAllowed('oembed.rich', "resizable")) {
                rels.push(CONFIG.R.resizable);
            }
        } else {
            widget.width = oembed.width;
            widget.height = oembed.height
        }

        if (iframe && iframe.src && iframe.allow) {
            widget.rel = widget.rel.concat(iframe.allow.replace(/autoplay;?\s?\*?/ig, '').split(/\s?\*?;\s?\*?/g));
        }        

        return widget;
    },


    /** Tests are only applicable with the whitelist, otherwise will throw errors on Test UI.
     * tests: [
     *   "http://list.ly/list/303-alternatives-to-twitter-bootstrap-html5-css3-responsive-framework" //Oembed rich reader
     * ]
     */

};