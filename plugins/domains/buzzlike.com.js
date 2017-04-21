module.exports = {

    re: [
        /((https?:\/\/)?widget.)?buzzlike\.com\/[\w]+\/[\w-]+/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {
        return {
            html: '<div class="bzl-widget" data-url="' + urlMatch[0] + '" data-width="100%" data-share="0"></div><script src="https://b.static.buzzlike.com/app/embed/dist/embed.js" async type="text/javascript"></script>',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5]
        }
    },

    getMeta: function() {
        return {
            site: 'Buzzlike',
        };
    },


    tests: [
        "https://widget.buzzlike.com/poll/a14493e6-f8fa-11e6-aee7-22000b0d85a7",
        "https://widget.buzzlike.com/sweepstake/ff780f7f-20de-44ec-9232-1acefe7437b8"
    ]
};
