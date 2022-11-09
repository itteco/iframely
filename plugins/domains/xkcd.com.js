import { decodeHTML5 } from 'entities';

export default {

    re: /^https?:\/\/(?:www.)?xkcd\.com\/\d+/i,

    mixins: ["*", "og-image-rel-image"],

    tests: [{
        pageWithFeed: 'http://xkcd.com/'
    },
        "http://xkcd.com/1392/", // Large image present.
        "http://xkcd.com/731/",
        "http://www.xkcd.com/1709/"
    ]
};