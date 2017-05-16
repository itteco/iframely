var URL = require("url");

module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?podcastone\.com\/pg\/jsp\/program\/episode\.jsp\?/i,
        /^https?:\/\/(?:www\.)?podcastone\.com\/(embed|program)\?/i,
    ],

    mixins: [
        "*"
    ],

    getLink: function(url) {

        url = URL.parse(url,true);

        var query = url.query;
        var progID = query.programID || query.progID;
        var pid = query.pid || '0';

        if (progID) {

            return {
                href: '//www.podcastone.com/embed?progID=' + progID + '&pid=' + pid,            
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.html5, CONFIG.R.player, CONFIG.R.oembed], // `oembed` allows to have player href=canonical
                height: 410, 
                width: 310,
                scrolling: 'no'
            };
        }
    },

    tests: [
        'http://podcastone.com/pg/jsp/program/episode.jsp?programID=975&pid=1685628',
        'http://www.podcastone.com/embed?progID=975&pid=1685628'        
    ]
};