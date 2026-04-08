
export default {

    provides: [
        // Run for all who requests htmlparser or meta.
        'htmlparser',
        '__allowHtmlparser'
    ],

    getData: function() {
        return {
            __allowHtmlparser: true
        };
    }
};
