    export const DEFAULT_PARAMS = [
        "url",
        "urlMatch",
        "cb",
        "options",
        "request",
        "whitelistRecord",
        "iframelyRun",

        // Copy from `core.js` `utilsModules`.
        "utils",
        "htmlUtils",
        "metaUtils",
        "oembedUtils",
        "plugins",
        "prepareLinkMedia",
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
        "getVars",
        "prepareLink"
    ];

    const GET_VARS_ALIAS = [
        'signals',
        'policy',
        'sources'
    ];

    export const GET_VARS_METHODS = {
        // getSignals: signals
    };

    // Adds `GET_VARS_ALIAS` to `PLUGIN_METHODS` as `signals` => `getSignals`.
    // Fills `GET_VARS_METHODS` with proper key values.
    GET_VARS_ALIAS.forEach(alias => {
        const methodName = `get${alias[0].toUpperCase()}${alias.substring(1)}`;
        PLUGIN_METHODS.push(methodName);
        GET_VARS_METHODS[methodName] = alias;
    });

    export const PLUGIN_FIELDS = PLUGIN_METHODS.concat([
        "mixins"
    ]);
