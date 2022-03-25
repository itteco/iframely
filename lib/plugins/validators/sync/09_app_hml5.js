export default {

    prepareLink: function(link) {
        // Add 'html5' rel to 'app'.
        if ((link.rel.indexOf('app') > -1 || link.rel.indexOf('summary') > -1) && link.rel.indexOf('html5') === -1) {
            link.rel.push('html5');
        }
    }
};