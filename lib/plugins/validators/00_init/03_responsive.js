module.exports = {

    prepareLink: function(link, options) {

        moveMediaAttrs(link, options);

        if (link.rel.indexOf('responsive') > -1
            && link.rel.indexOf(CONFIG.R.player) > -1) {

            makeMediaResponsive(link);
        }
    }
};