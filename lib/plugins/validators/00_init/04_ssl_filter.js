module.exports = {

    prepareLink: function(link, options) {

        var sslProtocol = link.href && link.href.match(/(https:)?\/\//i);
        var hasSSL = link.rel.indexOf('ssl') > -1;
        var isImage = link.type.indexOf('image') === 0;
        var isHTML5Video = link.type.indexOf('video/') === 0;

        if (sslProtocol && !hasSSL) {
            link.rel.push('ssl');
        }

        if (sslProtocol || hasSSL || isImage || isHTML5Video) {
            // Good: has ssl.
        } else if (options.filterNonSSL) {
            // Filter non ssl if required.
            link.error = 'Non SSL filtered';
        }
    }
};