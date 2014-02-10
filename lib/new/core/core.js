(function(core) {

    var _ = require('underscore');

    var utils = require('./utils'),
        pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict,
        pluginsList = pluginLoader._pluginsList,
        usedParamsDict = pluginLoader._usedParamsDict,
        PLUGIN_METHODS = utils.PLUGIN_METHODS;

    var TIMER = false;
    var METHOD_TIMEOUT = 10000;

    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies (up and down by tree).
     * */
    function findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, requiredPlugins) {

       /*
        * Params:
        *
        *
        * pluginId - id of plugin where methods to run will be found.
        *
        *
        * loadedParams - list of currently loaded params keys.
        * var loadedParams = _.keys(context);
        * loadedParams = ['cb', 'uri', 'title', 'meta']
        *
        *
        * pluginsUrlMatches - dict of urlMatches for specific plugins.
        * pluginsUrlMatches = {
        *   pluginId: matchObj
        * }
        *
        *
        * usedMethods - global dict with registered to run, or finished methods.
        * This is used control each async function state.
        * usedMethods = {
        *   pluginId: {
        *       methodName1: false, // - method registered to run.
        *       methodName2: true,  // - method finished.
        *   }
        * }
        *
        *
        * usedParams - global dict of params used or asked to use in searched plugins.
        * This dict used to determine new params (mandatory params), which could be used in some new plugins.
        * E.g. plugin can return 'youtube_data' param. And then core will find plugins which will use 'youtube_data' to provide embed code.
        * This is used for "go down by tree" algorithm.
        * usedParams = {
        *   paramName: true
        * }
        *
        *
        * methods - result methods to run list. This is main returned value.
        * methods = [{
        *   pluginId: pluginId,
        *   name: methodName,
        *   handle: <function>
        * }]
        *
        *
        * scannedPluginsIds - all plugins scanned in one 'runPlugins' iteration with single loadedParams set.
        * Used to prevent recursion in one iteration.
        * scannedPluginsIds = {
        *   pluginId: true
        * }
        *
        *
        * mandatoryParams - list of new params not used by plugins. Core will find what can use them.
        * 'mandatoryParams' enables mandatory mode: function will use _only_ methods which has this input 'mandatoryParams'.
        * This is used for "go down by tree" algorithm.
        * var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));
        * mandatoryParams = [
        *   paramName
        * ]
        *
        *
        * requiredPlugins -- list of plugins that is required to run. It could be list of domain plugins or list
        * of plugins, which work with 'mandatoryParams'. List used only for adding some mandatory plugins.
        * This is used for "go down by tree" algorithm.
        * requiredPlugins = [
        *   pluginInstance
        * ]
        *
        * */

        //
        // usedMethods -

        // Do not process plugin twice (if recursive dependency).
        if (pluginId in scannedPluginsIds) {
            return;
        }

        var plugin = plugins[pluginId];
        if (!plugin) {
            return;
        }

        // Register result array.
        scannedPluginsIds[plugin.id] = true;

        // Process all mixins.
        var mixins = plugin.module.mixins;
        if (mixins) {
            for(var i = 0; i < mixins.length; i++) {
                findPluginMethods(mixins[i], loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, requiredPlugins);
            }
        }

        var usedPluginMethods = usedMethods[plugin.id] = usedMethods[plugin.id] || {};

        // Check each plugin method.
        for(var i = 0; i < PLUGIN_METHODS.length; i++) {

            var method = PLUGIN_METHODS[i];

            if (method in plugin.methods) {

                // Skip used method.
                if (usedPluginMethods && (method in usedPluginMethods)) {
                    continue;
                }

                var params = plugin.methods[method];

                // If mandatory params mode.
                if (mandatoryParams && mandatoryParams.length > 0) {

                    if (_.intersection(params, mandatoryParams).length === 0) {
                        // Skip method if its not using mandatory params.
                        continue;

                    } else {
                        var j;
                        for(j = 0; j < requiredPlugins.length && requiredPlugins[j].id !== pluginId; j++);
                        if (j === requiredPlugins.length) {
                            // TODO: not sure if that is really needed - check it!!!
                            // If current plugin uses mandatory params - add it to requiredPlugins.
                            // It could run far later when its dependencies loaded.
                            requiredPlugins.push(plugin);
                        }
                    }
                }

                var absentParams = _.difference(params, loadedParams);

                // 'ulrMatch' workaround.
                // Each plugin can have own match, or no match at all.
                var urlMatchParamIdx = absentParams.indexOf('urlMatch');
                if (urlMatchParamIdx > -1) {
                    if (pluginsUrlMatches[pluginId]) {
                        // If 'urlMatch' for plugin found - remove from 'absentParams'.
                        absentParams.splice(urlMatchParamIdx, 1);
                    } else {
                        // Skip method with 'urlMatch' required. Match not found for that plugin.
                        continue;
                    }
                }

                if (absentParams.length > 0) {

                    // This branch finds methods in upper dependencies tree.

                    // Find absent params in other plugins 'provides' attribute.
                    for(var j = 0; j < absentParams.length; j++) {
                        var param = absentParams[j];
                        var paramPlugins = providedParamsDict[param];
                        if (paramPlugins && paramPlugins.length) {

                            // Store dependency param. Need to determine mandatory params in feature.
                            usedParams[param] = true;

                            for(var k = 0; k < paramPlugins.length; k++) {
                                var pluginId = paramPlugins[k];
                                findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, requiredPlugins);
                            }
                        }
                    }

                } else {

                    // This branch goes down by the tree.

                    // Mark method used but not finished.
                    usedPluginMethods[method] = false;

                    // Method will run, store in result set.
                    methods.push({
                        pluginId: pluginId,
                        name: method,
                        handle: plugin.module[method]
                    });
                }
            }
        }
    }


    function runMethods(methods, context, pluginsUrlMatches, usedMethods, asyncMethodCb) {

        var results = [];

        for(var i = 0; i < methods.length; i++) {
            (function() {

                var method = methods[i];

                var plugin = plugins[method.pluginId];

                var params = plugin.methods[method.name];

                var args = [];

                var methodTimer;
                if (TIMER) {
                    methodTimer = utils.createTimer();
                }

                var asyncMethod = false;

                var timeout;

                var callback = function(error, data) {

                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    } else if (asyncMethod) {
                        return;
                    }

                    // Mark method finished.
                    var usedPluginMethods = usedMethods[plugin.id];
                    usedPluginMethods[method.name] = true;

                    if (data) {
                        for(var key in data) {
                            var v = data[key];
                            if (v === null || (typeof v === 'undefined') || (typeof v === 'number' && isNaN(v))) {
                                delete data[key];
                            }
                        }
                    }

                    var result = {
                        method: method,
                        data: data
                    };

                    if (TIMER) {
                        result.time = methodTimer();
                    }

                    if (error) {
                        if (error instanceof Error) {
                            error = error.toString();
                        }
                        console.error("Plugin error", plugin.id, method.name, error);
                        result.error = error;
                    }

                    // TODO: rerun plugins check.

                    if (asyncMethod) {
                        process.nextTick(function() {
                            asyncMethodCb(null, [result]);
                        });
                    } else {
                        results.push(result);
                    }
                };

                for(var j = 0; j < params.length; j++) {

                    var param = params[j];

                    if (param === 'cb') {

                        // Generate callback param.
                        asyncMethod = true;
                        args.push(callback);

                        continue;

                    } else if (param === 'urlMatch') {

                        // Generate 'urlMatch' param depending on plugin.

                        args.push(pluginsUrlMatches[method.pluginId]);

                        continue;
                    }

                    args.push(context[param]);
                }

                try {
                    // TODO: check timeout for async method.
                    if (asyncMethod) {
                        timeout = setTimeout(function() {
                            callback('timeout');
                        }, METHOD_TIMEOUT);
                    }
                    var result = method.handle.apply(plugin.module, args);
                } catch(ex) {
                    if (!asyncMethod) {
                        callback(ex);
                        // Prevent run sync callback.
                        asyncMethod = true;
                    }
                }

                // Sync callback.
                if (!asyncMethod) {
                    callback(null, result);
                }

            })();
        }

        if (results.length) {
            process.nextTick(function() {
                asyncMethodCb(null, results);
            });
        }
    }

    function runPlugins(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb) {

        var loadedParams = _.keys(context);

        var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));

        var scannedPluginsIds = {};
        var methods = [];

        for(var i = 0; i < requiredPlugins.length; i++) {
            var plugin = requiredPlugins[i];
            findPluginMethods(plugin.id, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
        }

        // TODO: gether secondaryPlugins by dict, who uses mandatory params. Not full for-loop.
        if (mandatoryParams && mandatoryParams.length > 0) {

            var secondaryPlugins = findPluginsForMandatoryParams(mandatoryParams, usedDomains);

            for(var i = 0; i < secondaryPlugins.length; i++) {
                var pluginId = secondaryPlugins[i];
                findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, requiredPlugins);
            }
        }

        runMethods(methods, context, pluginsUrlMatches, usedMethods, asyncMethodCb);

        return methods.length;
    }

    function getPluginsSet(uri, options) {

        var domain = uri.split('/')[2].replace(/^www\./i, "").toLowerCase();

        var initialPlugins = [],
            usedDomains = {};
            pluginsUrlMatches = {};

        var pluginMatchesByDomains = {};

        function registerDomainPlugin(plugin, match) {
            usedDomains[plugin.domain] = true;
            var domainPlugins = pluginMatchesByDomains[plugin.domain] = pluginMatchesByDomains[plugin.domain] || {};
            domainPlugins[plugin.id] = !!match;
        }

        for(var i = 0; i < pluginsList.length; i++) {
            var plugin = pluginsList[i];

            if (plugin.domain) {

                // Match only by regexp. Used in specific cases where domain changes (like national domain).

                var match = null, j = 0, res = plugin.re;
                while (!match && j < res.length) {
                    match = uri.match(res[j]);
                    j++;
                }
                if (match) {
                    // Store match for plugin.
                    registerDomainPlugin(plugin, match);
                    pluginsUrlMatches[plugin.id] = match;
                    continue;
                }

                // Straight match by domain.

                // Positive match on plugin.domain="domain.com", domain="sub.domain.com"
                // Positive match on plugin.domain="domain.com", domain="domain.com"
                var idx = domain.indexOf(plugin.domain);

                if (idx === -1 || ((idx > 0) && domain.charAt(idx - 1) !== '.')) {
                    // Break if not found, or not dot separation.
                    continue;
                }

                var match = (idx + plugin.domain.length) === domain.length;

                if (match) {
                    registerDomainPlugin(plugin, null);
                }
            }
        }

        function addAllGeneric() {
            // Use all generic plugins.
            for(var i = 0; i < pluginsList.length; i++) {
                var plugin = pluginsList[i];
                if (!plugin.domain && !plugin.custom) {
                    initialPlugins.push(plugin);
                }
            }
        }

        // In domain debug: add all plugins before domain plugins to make them low priority.
        if (options.mixAllWithDomainPlugin) {
            addAllGeneric();
        }

        for(var domain in pluginMatchesByDomains) {
            var domainPlugins = pluginMatchesByDomains[domain];

            var matchedPluginsNames = [];

            // Find domain plugins with re match.
            for(var pluginId in domainPlugins) {
                var match = domainPlugins[pluginId];
                if (match) {
                    matchedPluginsNames.push(pluginId);
                }
            }

            // If no re match - use all domain plugins.
            if (matchedPluginsNames.length === 0) {
                matchedPluginsNames = _.keys(domainPlugins);
            }

            for(var i = 0; i < matchedPluginsNames.length; i++) {
                var pluginId = matchedPluginsNames[i];
                initialPlugins.push(plugins[pluginId]);
            }
        }

        // If not domain or no domain plugins - fill with generic.
        if (initialPlugins.length === 0) {
            addAllGeneric();
        }

        return {
            initialPlugins: initialPlugins,
            pluginsUrlMatches: pluginsUrlMatches,
            usedDomains: usedDomains
        };
    }

    /*
    * Find plugins which can use 'mandatoryParams'.
    * */
    function findPluginsForMandatoryParams(mandatoryParams, usedDomains) {

        var foundPluginsDict = {},
            result = [];

        for(var i = 0; i < mandatoryParams.length; i++) {
            var pluginsIds = usedParamsDict[mandatoryParams[i]];
            if (pluginsIds) {
                for(var j = 0; j < pluginsIds.length; j++) {
                    var pluginId = pluginsIds[j];
                    var plugin = plugins[pluginId];
                    // Prevent duplicates.
                    // Use only generic plugins or plugins from matched domain.
                    if (!(pluginId in foundPluginsDict) && (!plugin.domain || plugin.domain in usedDomains)) {
                        foundPluginsDict[pluginId] = true;
                        result.push(pluginId)
                    }
                }
            }
        }

        return result;
    }

    function useResult(context, allResults, result) {

        for(var i = 0; i < result.length; i++) {

            var r = result[i];

            // Collect total result.
            allResults.push(r);

            if (r.data && r.data.title && !context.title) {
                // Store title.
                context.title = r.data.title;
            }

            if (r.data) {

                if (!(r.data instanceof Object)) {

                    // Check if method result is Object.

                    console.error('Non object returned in', r.method.pluginId, r.method.name);

                    r.error = 'Non object returned';

                } else if (r.method.name === 'getData') {

                    // Extend context with 'getData' result.

                    for(var key in r.data) {
                        // First data has priority, do not override it.
                        if (!(key in context)) {
                            context[key] = r.data[key];
                        }
                    }
                }
            }
        }
    }

    function run(uri, options, cb) {

        var pluginsSet = getPluginsSet(uri, options);

        var requiredPlugins = pluginsSet.initialPlugins,
            pluginsUrlMatches = pluginsSet.pluginsUrlMatches,
            usedDomains = pluginsSet.usedDomains,

            // Initial context.
            context = {
                uri: uri,
                cb: true
            },

            allResults = [],
            usedMethods = {},

            // Mark initial context params as used.
            usedParams = {
                uri: true,
                cb: true
            },

            asyncMethodCb = function(error, result) {

                useResult(context, allResults, result);

                var hasRuns = runPlugins(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb);

                if (hasRuns === 0) {
                    for(var pluginId in usedMethods) {
                        var pluginMethods = usedMethods[pluginId];
                        for(var method in pluginMethods) {
                            if (!pluginMethods[method]) {
                                return;
                            }
                        }
                    }

                    cb(null, allResults);
                }
            };

        runPlugins(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb);
    }


    run('http://test.com', {}, function(error, result) {
        console.log(JSON.stringify(result, null, 4));
        console.log('FINISH');
    });


    run('http://antirez.com/articoli/tclmisunderstood.html', {}, function(error, result) {
        result.forEach(function(r) {
            console.log('---------------');
            console.log(r.method);
            if (r.data && r.data.htmlparser) {
                r.data.htmlparser = true;
            }
            if (r.data)
                console.log(r.data);
            if (r.error)
                console.log('error:', r.error);
        })
        //console.log(JSON.stringify(result, null, 4));
        console.log('FINISH');
    });


})(exports);