module.exports = {

    prepareLink: function(link, options) {

        var isAutoplay = link.rel.indexOf('autoplay') > -1;

        if (options.filterAutoplay && isAutoplay) {
            // Filter autoplay.
            link.error = 'Autoplay filtered';
        }
    }
};