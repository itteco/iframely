(function(utils) {

    utils.DEFAULT_PARAMS = [
        "url",
        "urlMatch",
        "cb"
    ];

    utils.PLUGIN_FIELDS_TYPE_DICT = {
        "getLink": Function,
        "getLinks": Function,
        "getData": Function,
        "mixins": Array
    };

    utils.PLUGIN_METHODS = [
        "getLink",
        "getLinks",
        "getData",
        "getMeta"
    ];

    utils.PLUGIN_FIELDS = utils.PLUGIN_METHODS.concat([
        "mixins"
    ]);

    utils.createTimer = function() {

        var timer = new Date().getTime();

        return function() {
            return new Date().getTime() - timer;
        };
    };

})(exports);