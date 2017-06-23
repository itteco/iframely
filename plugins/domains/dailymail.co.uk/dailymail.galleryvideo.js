module.exports = {

    re: [        
        /https?:\/\/www\.dailymail\.co\.uk\/video\/\w+\/video\-(\d+)\//i
    ],

    provides: 'dailymailVideoID',

    mixins: ['*'],

    getData: function(urlMatch, og) {

        if (og.video && og.video.url && /_(\d+)\.mp4$/i.test(og.video.url)) {
            return {
                dailymailVideoID: 'v-' + og.video.url.match(/_(\d+)\.mp4$/i)[1]
            }
        }
    },    

    tests: [{
        noFeeds: true
    },
        "http://www.dailymail.co.uk/video/news/video-1284607/Heart-rending-scenes-child-marriage-ceremonies-India.html"
    ]
};