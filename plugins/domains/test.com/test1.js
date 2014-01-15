module.exports = {

    provides: 'test_data1',

    getData: function() {
        return {
            test_data1: true
        };
    },

    tests: {
        noTest: true
    }
};