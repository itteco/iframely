var $ = require('cheerio');
var entities = require('entities');

module.exports = {

    re: /^https?:\/\/(?:www\.)?strawpoll\.me\/([0-9]+)$/i,

    mixins: ["*"],

    getLink: function(urlMatch, cheerio) {

        var embed = entities.decodeHTML(cheerio('#embed-field-' + urlMatch[1]).attr('value'));
        var iframe = $('<div>').html(embed).children('iframe');
        var height = parseInt(iframe.css('height').replace(/px$/, ''), 10) || 300;
        var width = parseInt(iframe.css('width').replace(/px$/, ''), 10) || 690;

        return {
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.ssl, CONFIG.R.html5],
            href: 'https://www.strawpoll.me/embed_1/' + urlMatch[1],
            height: height,
            'max-width': width,
            scrolling: 'no'    
        };

    },

    tests: [
        "http://www.strawpoll.me/1696",
        "https://strawpoll.me/136"
    ]
};
