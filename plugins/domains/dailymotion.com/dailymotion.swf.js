export default {

    re: [
        /^https?:\/\/www\.dailymotion\.com\/(?:swf|embed)\/video\/([a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:geo\.)?dailymotion\.com\/player(?:\/[a-zA-Z0-9]+)?\.html\?video=([a-zA-Z0-9]+)/i
    ],

    listed: false,

    getLink: function (urlMatch, cb) {
        return cb({
            redirect: 'https://www.dailymotion.com/video/' + urlMatch[1]
        });
    }
};