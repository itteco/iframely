(function(utils) {

    // TODO: not used anywhere.
    utils.DEFAULT_PARAMS = [
        "url",
        "urlMatch",
        "cb",
        "options",
        "request",
        "whitelistRecord",
        "readabilityEnabled",
        "forcePromo"
    ];

    utils.POST_PLUGIN_DEFAULT_PARAMS = [
        "link",
        "pluginContext",
        "pluginId"
    ];

    utils.PLUGIN_FIELDS_TYPE_DICT = {
        "getLink": Function,
        "getLinks": Function,
        "getData": Function,
        "prepareLink": Function,
        "mixins": Array
    };

    utils.PLUGIN_METHODS = [
        "getLink",
        "getLinks",
        "getData",
        "getMeta",
        "prepareLink"
    ];

    utils.PLUGIN_FIELDS = utils.PLUGIN_METHODS.concat([
        "mixins"
    ]);

})(exports);