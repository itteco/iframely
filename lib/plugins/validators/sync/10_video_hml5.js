module.exports = {

    prepareLink: function(link) {
        // Add 'html5' rel to 'video/*'.
        if (link.type && link.type.indexOf('video/') === 0) {

            if (link.rel.indexOf('html5') === -1) {
                link.rel.push('html5');
            }

            if (link.rel.indexOf('player') === -1) {
                link.rel.push('player');
            }
        }
    }
};