module.exports = {

    re: /^https?:\/\/www\.youtube\.com\/shared\/?\?ci=([a-zA-Z0-9_-]+)/i,

    getLink: function(og, cb) {

        if (og.image && /^https?:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\//i.test(og.image)) {

            cb ({
                redirect: "https://www.youtube.com/watch?v=" + og.image.match(/^https?:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\//i)[1]
            }); 
        } else {
            cb(null, null);
        }
    }
    //https://www.youtube.com/shared?ci=9NGUZOAn0K8
    //https://www.youtube.com/shared?ci=GUIIMO7uD-k
};