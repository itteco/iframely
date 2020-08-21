module.exports = {

    re: /(https?:\/\/jsfiddle.net\/\w+\/\w+\/).*/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {        
        var src = urlMatch[1].replace(/^http:\/\//i, 'https://') + "embed/"; 
        return {            
            html: `<script async src="${src}"></script>`,
            type: CONFIG.T.text_html, // iFrame embed option returns x-frame-options for validators
            rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl]
        };
    },

    tests: [
        "https://jsfiddle.net/pborreli/pJgyu/",
        "https://jsfiddle.net/timwienk/LgJsN/",
        {
            noFeeds: true
        }
    ]
};