module.exports = {

    // Embed code fonts color equals background color.

    re: /http:\/\/pastie\.org\/(\d+)/i,

    getMeta: function(urlMatch) {
        return {
            title: '#' + urlMatch[1] + ' - Pastie'
        };
    },

    getLink: function(urlMatch) {
        return {
            html: '<script type="text/javascript" src="http://pastie.org/' + urlMatch[1] +'.js"></script>',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app
        };
    }

};