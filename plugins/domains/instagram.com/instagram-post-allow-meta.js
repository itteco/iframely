import instagram_com from './instagram.com.js';

export default {

    re: instagram_com.re,

    provides: 'ipOG',

    getData: function(__allowInstagramMeta, meta) {
        return {
            ipOG: meta.og ? meta.og : {}
        }
    }
};