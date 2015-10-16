module.exports = {

    re: /^https?:\/\/www\.vgtv\.no\/#!\/video\/(\d+)\//i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'http://www.vgtv.no/embed/?id=' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            'aspect-ratio': 560/315
        };
    },

    tests: [
        "http://www.vgtv.no/#!/video/84634/se-overvaakningsvideoen-fra-ranet-av-kjell-83",
        "http://www.vgtv.no/#!/video/84633/roskilde-festivalen-2014-torsdag",
        "http://www.vgtv.no/#!/video/84586/sjarmvarsel-moet-fireaaringen-som-herjer-paa-basketbanen"
    ]
};