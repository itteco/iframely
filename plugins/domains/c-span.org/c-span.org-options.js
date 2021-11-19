module.exports = {

    re: require('./c-span.org.js').re,

    getData: function(url, options) {
        options.exposeStatusCode = true;
    }
};