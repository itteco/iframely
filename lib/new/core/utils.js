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
        "mixins": Array,
        "provides": Array
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

})(exports);