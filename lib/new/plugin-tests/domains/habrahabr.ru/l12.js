module.exports = {

    provides: ['habr_data2', 'habr_data3'],

    getData: function(meta) {
        return {
            habr_data2: true,
            habr_data3: true
        };
    }
};