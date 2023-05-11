    export const DEFAULT_PARAMS = [
        "url",
        "urlMatch",
        "cb",
        "options",
        "request",
        "whitelistRecord",
        "iframelyRun",
        "__readabilityEnabled",

        // Copy from `core.js` `utilsModules`.
        "utils",
        "htmlUtils",
        "metaUtils",
        "plugins",
        "log",
        "cache"
    ];

    export const POST_PLUGIN_DEFAULT_PARAMS = [
        "link",
        "pluginContext",
        "plugin",
        "templates",
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