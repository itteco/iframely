module.exports = {

    re: /^https:\/\/angel\.co\/([a-z-]+)/i,

    mixins: [
        "keywords",
        "favicon"
    ],

    getMeta: function(urlMatch, meta) {
        // AngelList is weird: they give Twitter Cards for companies (no og), but OG only for people profiles. 
        // Thus, the IFs

        var semantics = meta.twitter ? meta.twitter : meta.og;

        return {
            title: semantics.title,
            description: semantics.description,
            canonical: urlMatch[0]
        }
    },

    getLink: function(urlMatch, meta) {

        var result = [{
                href: (meta.og && meta.og.image) ? meta.og.image : meta.twitter.image.src,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }];

        if (meta.twitter && meta.twitter.title) {
            result.push({
                template_context: {
                    title: meta.twitter.title,
                    id: meta.twitter.image.src.match(/\/i\/(\d+)-/)[1],
                    slug: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline],
                width: 560 + 40 + 10,
                height: 300 + 40 + 10
            });
        }
        
        return result;
    },

    tests: [{
        page: "https://angel.co/",
        selector: ".name a"
    },
        "https://angel.co/gumroad/jobs"
    ]
};