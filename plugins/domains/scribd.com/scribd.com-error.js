import * as URL from "url";
import scribd_com from './scribd.com.js';

export default {

    re: scribd_com.re,

    provides: ["scribdData"],

    getData: function(oembedError, cb, url, options, urlMatch, request) {

        if (oembedError === 401 && /(\?|&)secret_password=/.test(url)) {

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
