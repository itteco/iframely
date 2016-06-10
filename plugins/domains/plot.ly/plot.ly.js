module.exports = {

    re: /^https?:\/\/plot\.ly\/~(\w+)\/(\d+)/i,

    mixins: [
        "*"
    ],

    getLink: function(url, urlMatch, twitter) {
        var img_src = twitter.image.src || twitter.image;

        if (twitter.card === 'photo' && img_src && /^https?:\/\/plot\.ly\/~/i.test(img_src)) {
            
            return {
                template_context: {
                    url: url,
                    id: urlMatch[1] + ':' + urlMatch[2],
                    img_src: twitter.image,
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5]
            }
        }

    },

    tests: [
        "https://plot.ly/~Vox/17/cumulative-emissions-from-fossil-fuel-and-cement-1870-2013/",
        "https://plot.ly/~jbatucan/2/col2/",
        "https://plot.ly/~avnerkantor/203/"
    ]
};