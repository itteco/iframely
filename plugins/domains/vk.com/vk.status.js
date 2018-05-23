module.exports = {

    provides: "vk_status",

    re: [
        /^https?:\/\/(?:m|new\.)?vk\.com\/[a-z0-9_-]+\?w=wall([0-9-]+)_(\d+)/i,
        /^https?:\/\/(?:m|new\.)?vk\.com\/wall([0-9-]+)_(\d+)/i
    ],

    mixins: ["favicon"],

    getMeta: function (vk_status, meta) {

        return {
            description: vk_status.text || (meta.og && meta.og.description),
            title: (meta.og && meta.og.title) || meta['html-title'],
            date: vk_status.date
        }

    },

    getLinks: function(vk_status, options) {

        var result = [];

        if (vk_status.embed_hash) {

            result.push({
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline],
                template_context: {
                    element_id: vk_status.element_id,
                    owner_id: vk_status.owner_id,
                    width: options.maxWidth,
                    hash: vk_status.embed_hash
                },
                width: options.maxWidth
            });
        } else {
            result.push ({
                message: "VK gives per-user security hash for embeds. Get one from their embed code (<a href='http://take.ms/Mkjc6see' target='_blank'>see where</a>) and add it as ?hash=... to your URL"
            });
        }

        if (vk_status.image) {

            result.push ({
                href: vk_status.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            })
        }

        return result;
    },

    getData: function (url, urlMatch, meta, request, cb, options) {

        // catch videos posted as statuses
        if (meta.og && meta.og.url && meta.og.url !== url) {
            return cb({
                redirect: meta.og.url
            });
        }
        // else 
        request({
            uri: "https://api.vk.com/method/wall.getById", //?posts=-76229642_10505
            qs: {
                posts: urlMatch[1] + '_' +urlMatch[2],
                v: '5.60'
            },
            json: true,
            prepareResult: function(error, b, data, cb) {

                if (error) {
                    return cb(error);
                }

                if (data.response && data.response.length > 0) {

                    var status = data.response[0];
                    var m = url.match(/hash=([\w-]+)/i);

                    cb(null, {
                        vk_status: {
                            date: status.date,
                            text: status.text,
                            image: status.attachment && ((status.attachment.photo && (status.attachment.photo.src_big || status.attachment.photo.src_big)) || status.attachment.video && status.attachment.video.image),
                            embed_hash: status.embed_hash || (m && m[1]),
                            element_id: urlMatch[2],
                            owner_id: urlMatch[1]
                        }
                    });
                } else {
                    cb({responseStatusCode: 404});
                }
            }
        }, cb);


    },

    tests: [
        "http://vk.com/wall1_45616?hash=Zsw6OdFrrA5KJZQJUcb8"
    ]

};