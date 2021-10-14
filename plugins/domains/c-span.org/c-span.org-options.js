import c_span_org from './c-span.org.js';

export default {

    re: c_span_org.re,

    getData: function(url, options) {
        options.exposeStatusCode = true;
    }
};