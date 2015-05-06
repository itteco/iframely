module.exports = {

    re: /^https?:(\/\/\w+\.cartodb\.com\/(?:u\/\w+\/)?viz\/[a-z0-9-]+)/i,

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-rich"
    ],

    tests: [
        "http://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/public_map",
        "https://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/embed_map",
        "https://smb2stfinitesubs1.cartodb.com/viz/39e625ee-cef3-11e4-b8bb-0e0c41326911/public_map"
    ]
};