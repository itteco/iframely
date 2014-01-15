module.exports = {

    provides: 'test_data1',

    getData: function(meta, cb) {
        setTimeout(function() {
            cb(null, {
                test_data1: true
            });
        }, 1000);
    },

    tests: {
        noTest: true
    }
};