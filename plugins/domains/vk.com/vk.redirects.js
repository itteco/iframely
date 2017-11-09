const URL = require('url');

module.exports = {

    re: [
        /^https?:\/\/(?:m|new\.)?vk\.com/i
    ],

    getData: function (url, meta, cb) {

        var query = URL.parse(url, true).query;

        if (!meta.og && query && query.z && /^video\-\d+_\d+/.test(query.z)) {

            return cb({
                redirect: 'https://vk.com/' + query.z.match(/^video\-\d+_\d+/)[0]
            })

        } else {

            return cb(
                meta["html-title"] == "Error | VK" || meta["html-title"] == "You are using an outdated browser."
                ? {responseStatusCode: 403}
                : null);

        }
    }
};