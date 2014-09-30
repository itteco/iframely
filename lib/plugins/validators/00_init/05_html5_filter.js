module.exports = {

    prepareLink: function(link, options) {

        var isImage = link.type.indexOf('image') === 0;
        var isHTML5Video = link.type.indexOf('video/') === 0;
        var hasHTML5 = link.rel.indexOf('html5') > -1;

        if (hasHTML5 || isImage || isHTML5Video) {
            // Good: is HTML5.
        } else if (options.filterNonHTML5) {
            // Filter non ssl if required.
            link.error = 'Non HTML5 filtered';
        }
    }
};