export default {

    re: /testok/i,

    mixins: [
      'html-title'
    ],

    getMeta: function() {
        return {
            description: 'custom description for test.com domain',
            site: "custom"
        };
    },
};
