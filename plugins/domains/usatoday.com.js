module.exports = {

    re: [
        /^https?:\/\/www\.(\w+)\.com\/media\/cinematic\/video\/(\d{7,9})\/[a-zA-Z0-9\-\_:\.]+\/?$/i,
        /^https?:\/\/www\.(\w+)\.com\/media\/cinematic\/video\/(\d{7,9})\/?$/i,
        /^https?:\/\/www\.(\w+)\.com\/videos\/\w+\/(?:[a-z0-9\/]+)?\d{4}\/\d{2}\/\d{2}\/(\d{7,9})\/?$/i,
        /^https?:\/\/www\.(\w+)\.com\/videos\/\w+\/(?:[a-z0-9\/]+)?\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9\-\_\.:]+\/(\d{7,9})\/?$/i
    ],

    provides: "gannettVideo",

    mixins: [
        "*"
    ],

    getData: function (urlMatch, twitter) {

        if (/^https?:\/\/www\.gannett\-cdn\.com\//i.test(twitter.image)) {
            return {
                gannettVideo: {
                    id: urlMatch[2],
                    domain: urlMatch[1]
                }
            }
        }
    },

    getLink: function (gannettVideo) {
        return {
            href: 'http://www.' + gannettVideo.domain +'.com/videos/embed/' + gannettVideo.id + '/?fullsite=true',
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.maybe_text_html, // let validators check it
            'aspect-ratio': 16/9,
            scrolling: 'no'
        }
    },

    tests: [
        "http://www.usatoday.com/media/cinematic/video/87694100/abdul-jabbar-mocks-trump-says-im-jordan/",
        "http://www.usatoday.com/videos/news/nation/2016/07/29/87694100/",
        "http://www.usatoday.com/videos/life/people/2016/11/03/93261598/",
        "http://www.usatoday.com/videos/news/humankind/2016/09/20/90730062/",
        "http://www.desertsun.com/media/cinematic/video/92390930/police-chief-quit-ignoring-red-flags/",
        "http://www.usatoday.com/videos/life/2016/11/09/93525560/",
        "http://www.usatoday.com/videos/news/politics/elections/2016/2016/11/09/93532206/",
        "http://www.usatoday.com/videos/sports/2016/12/20/behind-scenes:-michael-phelps-cover-shoot/95645660/",
        "http://www.usatoday.com/videos/news/2017/01/07/what-know-ft.-lauderdale-airport-shooter/96291014/",
        "http://www.cincinnati.com/media/cinematic/video/9430427/"
    ]
};