module.exports = {

    re: [
        /^https?:\/\/(?:renderer|preview)\.qmerce\.com\/interaction\/([a-z0-9]+)/i
    ],

    mixins: ['*'],

    provides: 'qmerce',

    getData: function(urlMatch, request, cb) {

        // need to detect the height
        request({
            uri: "http://preview.qmerce.com/api/interaction/" + urlMatch[1],
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

    getLink: function(qmerce, urlMatch) {
        return [{
            href: '//renderer.qmerce.com/interaction/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.html5],
            height: qmerce.data.size ? qmerce.data.size.height  : 400 // when "undefined" - no way to check the height :\
        }, {
            href: qmerce.image && qmerce.image.path && ('http://images.apester.com/' + qmerce.image.path.replace (/\//g, '%2F')),
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        }]
    },

    getMeta: function(qmerce) {
        return {
            title: qmerce.title,
            date: qmerce.updated || qmerce.created,
            author: qmerce.publisher && qmerce.publisher.name
        }
    },    

    tests: [
        "http://renderer.qmerce.com/interaction/5661a18763937fdb5ef4fa87",
        "http://renderer.qmerce.com/interaction/567cd70dc3b9c606515e7716",
        "http://renderer.qmerce.com/interaction/567af436781fde0551b3e049",
        "https://preview.qmerce.com/interaction/566e7dacd98c046319a768b4",
        "https://preview.qmerce.com/interaction/562a434547771a99601c3626",
        "http://renderer.qmerce.com/interaction/562146b041d4754d14603b18",
        "http://renderer.qmerce.com/interaction/569388818089e8dd05aff3a8",
        "https://renderer.qmerce.com/interaction/54d78df0a2eb4c424343c9f9"
    ]
};