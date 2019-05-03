module.exports = {

    re: /^https?:\/\/channel9\.msdn\.com\/Events\/([\w-]+\/\d+\/[\w-]+)/i,

    mixins: ["*"],

    getLink: function(urlMatch) {
        return {
            href: 'https://channel9.msdn.com/Events/' + urlMatch[1] + '/player',
            rel: [CONFIG.R.player, CONFIG.R.html5],
            accept: CONFIG.T.text_html,
            // Has issue with iframe size. Site always makes it bigger with scroller. But video fits.
            'aspect-ratio': 960/540
        };
    },

    tests: [{
        pageWithFeed: 'http://channel9.msdn.com/Events/dotnetConf/2014'
    },
        "http://channel9.msdn.com/Events/SharePoint-Conference/2014/KEY01"
    ]
};