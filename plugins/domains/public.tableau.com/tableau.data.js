module.exports = {

    re: [
        /^https?:\/\/public\.tableau\.com\/views\/([^\/]+)\/([^\/\?#]+)/i,
        /^https?:\/\/public\.tableau\.com\/profile\/[^\/\?#!]+#!\/vizhome\/([^\/]+)\/([^\/\?#]+)/i,
        /^https?:\/\/public\.tableau\.com\/profile\/publish\/([^\/]+)\/([^\/\?#]+)/i        
    ],

    provides: 'tableau',

    getData: function(urlMatch, request, options, cb) {

        request({
            uri: 'http://public.tableau.com/profile/api/single_workbook/' + urlMatch[1],
            json: true,
            prepareResult: function(error, response, body, cb) {

                var tableau = {
                    workbook: urlMatch[1],
                    view: urlMatch[2]
                };

                if (!error) {
                    tableau.title = body.title;
                    tableau.description = body.description || body.defaultViewName;
                    tableau.views = body.viewCount;
                    tableau.author = body.authorName;
                    tableau.date = body.lastUpdateDate;
                    tableau.showTabs = body.showTabs;
                }
                
                cb(error, {
                    tableau: tableau
                });
            }
        }, cb);

    },

    tests: [{
        noFeeds: true
    }]
};