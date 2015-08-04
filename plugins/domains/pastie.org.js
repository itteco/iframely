module.exports = {

    re: /http:\/\/pastie\.org\/(?:pastes\/)?(\d+)/i,

    getMeta: function(urlMatch) {
        return {
            title: '#' + urlMatch[1] + ' - Pastie'
        };
    },

    getLink: function(urlMatch) {
        return {
            html: '<script src="http://pastie.org/' + urlMatch[1] + '.js" type="text/javascript"></script>',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader // not inline :\
        };
    },

    tests: [ 
        "http://pastie.org/807135"
    ]    

};