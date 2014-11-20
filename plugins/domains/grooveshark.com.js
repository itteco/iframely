module.exports = {

    re: /https?:\/\/grooveshark\.com\/#!\//i,

    // re-direct the URLs with escape fragment to the canonical one
    getLink: function(url, whitelistRecord, cb) {

        cb({
            redirect: url.replace('#!/', '')
        });
    }
};