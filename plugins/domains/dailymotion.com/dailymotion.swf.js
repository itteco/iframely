module.exports = {

    re: /^https?:\/\/www\.dailymotion\.com\/swf\/video\//i,


    getLink: function (url, cb) {
        cb ({
            redirect: url.replace(/\/swf/, '')
        });
    }
};