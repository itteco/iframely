module.exports = {

    provides: 'test_data1',

    getData: function(cb) {
        setTimeout(function() {
            cb(null, {
                test_data1: true
            });
        }, 100);
    },

    tests: {
        noTest: true
    }
};