    // TODO: not used anywhere.
    export const DEFAULT_PARAMS = [
        "url",
        "urlMatch",
        "cb",
        "options",
        "request",
        "whitelistRecord",
        "__readabilityEnabled"
    ];

    export const POST_PLUGIN_DEFAULT_PARAMS = [
        "link",
        "pluginContext",
        "pluginId",
        "iterationPluginContext"
    ];

    export const PLUGIN_FIELDS_TYPE_DICT = {
        "getLink": Function,
        "getLinks": Function,
        "getData": Function,
        "prepareLink": Function,
        "mixins": Array
    };

    export const PLUGIN_METHODS = [
        "getLink",
        "getLinks",
        "getData",
        "getMeta",
        "prepareLink"
    ];

    export const PLUGIN_FIELDS = PLUGIN_METHODS.concat([
        "mixins"
    ]);