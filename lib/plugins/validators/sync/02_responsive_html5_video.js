module.exports = {

    prepareLink: function(link) {

        // Add 'responsive' tag for html5 videos.

        if (link.rel.indexOf('responsive') === -1 && link.type && link.type.indexOf('video/') === 0) {
            link.rel.push('responsive');
        }
    }
};