module.exports = {

    prepareLink: function(link) {
        // Add 'html5' rel to 'video/*'.
        if (link.type.indexOf('video/') === 0 && link.rel.indexOf('html5') === -1) {
            link.rel.push('html5');
        }
    }
};