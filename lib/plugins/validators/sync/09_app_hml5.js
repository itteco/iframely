module.exports = {

    prepareLink: function(link) {
        // Add 'hml5' rel to 'app'
        if (link.rel.indexOf('app') > -1 && link.rel.indexOf('html5') === -1) {
            link.rel.push('html5');
        }
    }
};