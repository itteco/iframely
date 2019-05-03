module.exports = {

    re: [        
        /https?:\/\/www\.dailymail\.co\.uk\/video\/\w+\/video\-(\d+)\//i
    ],

    provides: 'dailymailVideoID',

    mixins: ['*'],

    getData: function(urlMatch, og) {

        if (og.video && og.video.url) {
            return {
                dailymailVideoID: '' // it will be the only one on the page, see cherio parser
            }
        }
    },    

    tests: [{
        noFeeds: true
    },
        "https://www.dailymail.co.uk/video/news/video-1284607/Heart-rending-scenes-child-marriage-ceremonies-India.html"
    ]
};