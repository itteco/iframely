module.exports = {

    re: /^https?:\/\/(?:www\.)?strawpoll\.me\/([0-9]+)$/i,

    mixins: ["*"],

    getLink: function(urlMatch, $selector) {

        var height = parseInt(/;height:([0-9]+)px;/.exec($selector('#embed-field-' + urlMatch[1]).attr('value'))[1], 10) || 300;

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.ssl],
            html: '<iframe src="' + "//www.strawpoll.me/embed_1/" + urlMatch[1] + '" width="680" height="' + height + '" frameborder="no">Loading poll...</iframe>',
            height: height
        };
    },

    tests: [
        "http://www.strawpoll.me/1696",
        "https://strawpoll.me/136"
    ]
};
