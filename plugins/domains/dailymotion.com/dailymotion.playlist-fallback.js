export default {

    re: [
        /^https?:\/\/www\.dailymotion\.com\/playlist\//i,
    ],

    getData: function(url, __statusCode, cb) {
        cb({
            responseStatusCode: __statusCode
        });
    }
};
