module.exports = {

    re: [
        /^https?:\/\/(?:renderer|preview)\.qmerce\.com\/interaction\/([a-z0-9]+)/i,
        /^https?:\/\/(?:discover|www)?\.?apester\.com\/media\/([a-z0-9]+)/i,
        /^https?:\/\/app\.apester\.com\/editor\/([a-z0-9]+)/i     
    ],

    mixins: ['*'],

    provides: 'qmerce',

    getData: function(urlMatch, request, cb) {

        // need to detect the height
        request({
            uri: "http://renderer.qmerce.com/api/interaction/" + urlMatch[1],
            json: true,
            prepareResult: function(error, response, body, cb) {

                if (error) {
                    return cb(error);
                } 

                if (body.message !== 'ok' ) {
                    return cb(body.message);
                } else {
                    cb(null, {
                        qmerce: body.payload
                    });
                }
            }
        }, cb);
    },

    getLink: function(qmerce, url, urlMatch) {
        var links = [{
            href: '//renderer.qmerce.com/interaction/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.html5],
            height: qmerce.data.size ? qmerce.data.size.height  : 400 // when "undefined" - no way to check the height :\
        }];

        if (!/^https?:\/\/(?:discover|www)?\.?apester\.com\/media\/([a-z0-9]+)/i.test(url)) {
            links.push ({
                href: qmerce.image && qmerce.image.path && ('http://images.apester.com/' + qmerce.image.path.replace (/\//g, '%2F')),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            })
        } // else - og-image

        return links;
    },

    getMeta: function(qmerce) {
        return {
            title: qmerce.title,
            date: qmerce.updated || qmerce.created,
            author: qmerce.publisher && qmerce.publisher.name
        };
    },    

    tests: [{
        noFeeds: true
    },
        "http://renderer.qmerce.com/interaction/5661a18763937fdb5ef4fa87",
        "http://renderer.qmerce.com/interaction/567cd70dc3b9c606515e7716",
        "http://renderer.qmerce.com/interaction/567af436781fde0551b3e049",
        "https://preview.qmerce.com/interaction/566e7dacd98c046319a768b4",
        "https://preview.qmerce.com/interaction/562a434547771a99601c3626",
        "http://renderer.qmerce.com/interaction/562146b041d4754d14603b18",
        "http://renderer.qmerce.com/interaction/569388818089e8dd05aff3a8",
        "https://apester.com/media/5875af23122b4b812e143731?src=link",
        "http://www.apester.com/media/597e72726f3d040c0fa9087b"
    ]
};