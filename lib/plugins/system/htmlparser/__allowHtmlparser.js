
export default {

    provides: [
        // Run for all who requests htmlparser or meta.
        'htmlparser',
        'meta',
        '__allowHtmlparser'
    ],

    getData: function() {
        return {
            __allowHtmlparser: true
        };
    }
};
