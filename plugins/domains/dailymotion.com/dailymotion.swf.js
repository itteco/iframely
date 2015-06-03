module.exports = {

    re: /^https?:\/\/www\.dailymotion\.com\/swf\/video\//i,

    mixins: false,

    getLink: function (url, cb) {
        cb ({
            redirect: url.replace(/\/swf/, '')
        });
    }
};