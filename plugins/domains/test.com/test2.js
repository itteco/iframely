export default {

    provides: ['test_data2', 'test_plugin'],

    getData: function(test_data1) {
        return {
            test_data2: true,
            test_plugin: true
        };
    },

    tests: {
        noTest: true
    }
};