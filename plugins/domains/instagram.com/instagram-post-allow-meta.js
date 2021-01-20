module.exports = {

    re: require('./instagram.com').re,

    provides: 'ipOG',

    getData: function(__allowInstagramMeta, meta) {
        return {
            ipOG: meta.og ? meta.og : {}
        }
    }
};