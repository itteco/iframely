module.exports = {

    provides: 'test_data2',

    getData: function(test_data1) {
        return {
            test_data2: true
        };
    },

    tests: {
        noTest: true
    }
};