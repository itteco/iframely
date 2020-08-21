module.exports = {

    re: /^https?:\/\/www\.dailymotion\.com\/(swf|embed)\/video\//i,

    getLink: function (url, cb) {
        cb ({
            redirect: url.replace(/\/(swf|embed)/, '')
        });
    }
};