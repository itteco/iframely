module.exports = {

    re: [
        /^https?:\/\/(www\.)?huffingtonpost\.com\/entry\//i
    ],

    provides: "__isHuffPostVideo",

    mixins: [
        "*"
    ],

    getLink: function(__isHuffPostVideo, cheerio) {

        var $embed_code = cheerio('.video-page__video__embed-code');

        if ($embed_code.length) {
            console.log($embed_code.html());
            return {
                html: $embed_code.html(),
                rel: [CONFIG.R.player, CONFIG.R.inline, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.autoplay],
                type: CONFIG.T.text_html,
                'aspect-ratio': 16/9,
                'max-width': 640
            }
        }
    },

    getData: function(og, whitelistRecord) {

        if (og.type === 'video' && whitelistRecord.isAllowed && !whitelistRecord.isAllowed('og.video')) { 
            return {
                __isHuffPostVideo: true
            };        
        }
    },    

    tests: [
        "http://www.huffingtonpost.com/entry/how-to-make-your-own-cold-brew-coffee-youre-welcome_us_5772a361e4b017b379f7706a?section="
    ]

};