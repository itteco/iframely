module.exports = {

    re: [
        /^https?:\/\/www\.([a-z\-]+)\.com\/media\/cinematic\/video\/(\d{7,12})\/[a-zA-Z0-9\-\_:\.]+\/?(?:[^\/]+)?$/i,
        /^https?:\/\/www\.([a-z\-]+)\.com\/media\/cinematic\/video\/(\d{7,12})\/?(?:[^\/]+)?$/i,
        /^https?:\/\/www\.([a-z\-]+)\.com\/videos\/\w+\/(?:[a-z0-9\-\/]+)?\d{4}\/\d{2}\/\d{2}\/(\d{7,12})\/?(?:[^\/]+)?$/i,
        /^https?:\/\/www\.([a-z\-]+)\.com\/videos\/\w+\/(?:[a-z0-9\-\/]+)?\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9\-\_\.:]+\/(\d{7,12})\/?(?:[^\/]+)?$/i
    ],

    provides: "gannettVideo",

    mixins: [
        "*"
    ],

    getData: function (urlMatch, meta) {

        var img_src = meta.twitter && meta.twitter.image || meta.ld && meta.ld.videoobject && meta.ld.videoobject.thumbnailurl || meta.og && meta.og.image;

        if (img_src && (/^https?:\/\/\w+\.gannett\-cdn\.com\//i.test(img_src) || /^https?:\/\/videos\.usatoday\.net\//i.test(img_src) || /brightcove/i.test(img_src))) {
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
            href: 'https://uw-media.' + gannettVideo.domain +'.com/embed/video/' + gannettVideo.id + '/?placement=snow-embed',
            rel: [CONFIG.R.player, CONFIG.R.html5],
            accept: CONFIG.T.text_html, // let validators check it, including ssl            
            'aspect-ratio': 16/9,
            scrolling: 'no',
            autoplay: 'autoplay=1'
        }
    },

    tests: [
        "https://www.usatoday.com/videos/life/movies/academy-awards/2019/02/25/diversity-red-carpet-academy-awards/2980115002/",
        "https://www.guampdn.com/videos/news/local/2019/03/24/crab-festival-activities/3260939002/",
        "https://www.usatoday.com/videos/tech/2019/03/26/drones-flying-blood-north-carolina-hospital/3282276002/",
        "https://www.usatoday.com/videos/life/movies/2017/11/06/some-theaters-may-not-show-last-jedi-due-disneys-demands/107396942/?utm_source=feedblitz&utm_medium=FeedBlitzRss&utm_campaign=usatodaycommoney-topstories",
        "http://www.usatoday.com/media/cinematic/video/87694100/abdul-jabbar-mocks-trump-says-im-jordan/",
        "http://www.usatoday.com/videos/news/nation/2016/07/29/87694100/",
        "http://www.usatoday.com/videos/life/people/2016/11/03/93261598/",
        "http://www.usatoday.com/videos/news/humankind/2016/09/20/90730062/",
        "https://www.usatoday.com/videos/news/2018/07/03/white-house-twitter-account-attacks-senators-critical-ice/36581999/",
        "http://www.desertsun.com/media/cinematic/video/92390930/police-chief-quit-ignoring-red-flags/",
        "http://www.usatoday.com/videos/life/2016/11/09/93525560/",
        "http://www.usatoday.com/videos/news/politics/elections/2016/2016/11/09/93532206/",
        "http://www.usatoday.com/videos/sports/2016/12/20/behind-scenes:-michael-phelps-cover-shoot/95645660/",
        "http://www.usatoday.com/videos/news/2017/01/07/what-know-ft.-lauderdale-airport-shooter/96291014/",
        "http://www.cincinnati.com/media/cinematic/video/9430427/",
        "http://www.guampdn.com/videos/news/nation/2015/08/18/31948487/",
        "http://www.courier-journal.com/videos/sports/college/kentucky/2015/08/17/31862551/",
        "http://www.newarkadvocate.com/videos/sports/high-school/football/2015/08/15/31789999/",
        "http://www.citizen-times.com/videos/news/2015/08/17/31865067/",
        "http://www.sctimes.com/videos/weather/2015/08/17/31839437/",
        "http://www.baxterbulletin.com/videos/news/local/2015/08/17/31843911/",
        "http://www.delmarvanow.com/videos/sports/high-school/2015/08/18/31933549/",
        "https://www.courier-journal.com/videos/entertainment/2015/08/24/31920575/",
        "http://www.detroitnews.com/videos/sports/nfl/lions/2015/08/19/31954181/",
        "http://www.press-citizen.com/videos/news/education/k-12/2015/08/18/31959369/",
        "http://www.tennessean.com/videos/entertainment/2015/08/18/31958929/",
        "http://www.coloradoan.com/videos/sports/2015/08/18/31951489/",
        "https://www.thenewsstar.com/videos/news/2019/02/25/barge-traffic-swollen-mississippi-river/636614000/",
        "http://www.hawkcentral.com/videos/sports/college/iowa/football/2015/08/13/31628619/",
        "http://www.sheboyganpress.com/videos/sports/golf/2015/08/16/31830213/",
        "http://www.packersnews.com/videos/sports/nfl/packers/2015/08/15/31800211/",
        "http://www.shreveporttimes.com/videos/news/2015/08/18/31906711/"
    ] 
};