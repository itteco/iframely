const URL = require("url");

module.exports = {

    re: require('./scribd.com').re,

    mixins: [ "*" ],

    provides: ["scribdData"],

    getData: function(oembedError, cb, url, options, urlMatch, request) {

        if (oembedError === 401 && /secret_password=/.test(url) && urlMatch.length === 3) {

            var secret = URL.parse(url, true).query["secret_password"];

            request({
                uri: `https://www.scribd.com/doc-page/embed-modal-props/${urlMatch[2]}?secret_password=${secret}`,
                json: true,
                prepareResult: function(error, b, data, callback) {

                    if (error) {
                        return cb(error);
                    }

                    if (data.access_key) {

                        return cb(null, {
                            scribdData: {
                                href: `https://www.scribd.com/embeds/${urlMatch[2]}/content?start_page=1&view_mode=scroll&access_key=${data.access_key}`,
                                aspect: data.aspect_ratio
                            },
                        })

                    } else {

                        return cb(null, {
                            message: "Scribd doesn't support embedding of private documents"
                        })

                    }
                }
            }, cb);
        } else {
            return cb(null, null)
        }

    },

};
