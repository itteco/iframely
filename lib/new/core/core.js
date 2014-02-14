(function(core) {

    var _ = require('underscore');

    var coreUtils = require('./utils'),
        utils = require('../utils'),
        pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict,
        pluginsList = pluginLoader._pluginsList,
        usedParamsDict = pluginLoader._usedParamsDict,
        postPluginsList = pluginLoader._postPluginsList,
        PLUGIN_METHODS = coreUtils.PLUGIN_METHODS;

    var TIMER = true;
    var METHOD_TIMEOUT = 10000;

    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies (up and down by tree).
     * */
    function findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams) {

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
        * */

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
        if (!mandatoryParams) {
            var mixins = plugin.module.mixins;
            if (mixins) {
                for(var i = 0; i < mixins.length; i++) {
                    findPluginMethods(mixins[i], loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
                }
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
                                findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
                            }
                        }
                    }

                } else {

                    // This branch goes down by the tree.

                    // Mark method used but not finished.
                    usedPluginMethods[method] = 1;

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

    /*
    * Run list of methods.
    * */
    function runMethods(methods, context, pluginsUrlMatches, asyncMethodCb) {

        // Sync results list.
        var results = [];

        for(var i = 0; i < methods.length; i++) {
            (function() {

                var method = methods[i];

                var plugin = plugins[method.pluginId];

                var params = plugin.methods[method.name];

                var args = [];

                if (TIMER) {
                    var methodTimer = utils.createTimer();
                }

                var asyncMethod = false;

                var timeout;

                // Result callback for both sync and async methods.
                var callback = function(error, data) {

                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    } else if (asyncMethod) {
                        return;
                    }

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
                        // Grant real async if callback was called before function return.
                        process.nextTick(function() {
                            asyncMethodCb(null, [result]);
                        });
                    } else {

                        // Mark method finished - later, on results callback.
                        results.push(result);
                    }
                };

                // Prepare specific params (cb, urlMatch).
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
                            // In case of async timeout - call 'callback' with error param.
                            callback('timeout');
                        }, METHOD_TIMEOUT);
                    }

                    // Call method.
                    var result = method.handle.apply(plugin.module, args);

                } catch(ex) {

                    // Immediately stop method with error.
                    callback(ex);

                    if (!asyncMethod) {
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

        // Call sync methods result in next tick (imitate real async).
        if (results.length) {
            process.nextTick(function() {
                asyncMethodCb(null, results);
            });
        }
    }

    /*
    * Single iteration of run plugins wave.
    * */
    function runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb) {

        var loadedParams = _.keys(context);

        var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));

        // Reset scanned plugins for each iteration.
        var scannedPluginsIds = {};

        // Methods to run will be here.
        var methods = [];

        // Find methods in each required plugin.
        for(var i = 0; i < requiredPlugins.length; i++) {
            var plugin = requiredPlugins[i];
            findPluginMethods(plugin.id, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
        }

        // If has new unused params (mandatoryParams) - then find plugins which can use them.
        if (mandatoryParams && mandatoryParams.length > 0) {

            var secondaryPlugins = findPluginsForMandatoryParams(mandatoryParams, usedDomains);

            // Find methods in plugins, which can use mandatory params.
            for(var i = 0; i < secondaryPlugins.length; i++) {
                var pluginId = secondaryPlugins[i];
                findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams);
            }
        }

        // Run found methods.
        runMethods(methods, context, pluginsUrlMatches, asyncMethodCb);

        return methods.length;
    }

    function getPluginsSet(uri, options) {

        var domain = uri.split('/')[2].replace(/^www\./i, "").toLowerCase();

        var initialPlugins = [],
            usedDomains;
            pluginsUrlMatches = {};

        var pluginMatchesByDomains = {};

        function registerDomainPlugin(plugin, match) {
            usedDomains = usedDomains || {};
            usedDomains[plugin.domain] = true;
            var domainPlugins = pluginMatchesByDomains[plugin.domain] = pluginMatchesByDomains[plugin.domain] || {};
            domainPlugins[plugin.id] = !!match;
        }
        
        if (!options.useOnlyGenericPlugins) {
            
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

            // If no re match - use only non-re domain plugins.
            if (matchedPluginsNames.length === 0) {
                for(var pluginId in domainPlugins) {
                    var plugin = plugins[pluginId];
                    if (!plugin.re) {
                        matchedPluginsNames.push(pluginId);
                    }
                }
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
    *
    * Find only generic plugins or plugins from matched domain.
    * */
    function findPluginsForMandatoryParams(mandatoryParams, usedDomains) {

        var foundPluginsDict = {},
            result = [];

        // TODO: gether secondaryPlugins by dict, who uses mandatory params. Not full for-loop.
        for(var i = 0; i < mandatoryParams.length; i++) {
            var pluginsIds = usedParamsDict[mandatoryParams[i]];
            if (pluginsIds) {
                for(var j = 0; j < pluginsIds.length; j++) {
                    var pluginId = pluginsIds[j];
                    var plugin = plugins[pluginId];
                    // Prevent duplicates.
                    // Find only generic plugins or plugins from matched domain.
                    if (!(pluginId in foundPluginsDict) && (!plugin.domain || (usedDomains && (plugin.domain in usedDomains)))) {
                        foundPluginsDict[pluginId] = true;
                        result.push(pluginId);
                    }
                }
            }
        }

        return result;
    }

    function runPostPlugins(link, usedMethods, context, pluginsContexts, asyncMethodCb) {

        for(var i = 0; i < postPluginsList.length; i++) {
            (function() {

                // This will prevent lower priority plugins if previous _sync_ plugin placed link.error.
                if (link.error) {
                    return;
                }

                var plugin = postPluginsList[i];
                var method = 'prepareLink';
                var params = plugin.methods[method];
                var handle = plugin.module[method];

                var args = [];

                var asyncMethod = false;

                var finished = false;

                // Result callback for both sync and async methods.
                var callback = function(error) {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    if (error) {
                        if (error instanceof Error) {
                            error = error.toString();
                        }
                        console.error("Plugin error", plugin.id, method, error);
                    }

                    if (asyncMethod) {

                        // Grant real async if callback was called before function return.
                        process.nextTick(function() {

                            // Mark async method finished.
                            var usedPluginMethods = usedMethods[plugin.id];
                            usedPluginMethods[method] = usedPluginMethods[method] - 1;

                            // Call 'asyncMethodCb' only for async post plugin, because core must wait it.
                            asyncMethodCb();
                        });
                    }
                };

                // Prepare specific params (cb, urlMatch).
                for(var j = 0; j < params.length; j++) {

                    var param = params[j];

                    if (param === 'cb') {

                        // Generate callback param.
                        asyncMethod = true;
                        args.push(callback);

                        continue;

                    } else if (param === 'link') {

                        // Generate 'link' param.
                        args.push(link);

                        continue;

                    } else if (param === 'pluginContext') {

                        var pluginContext = pluginsContexts[plugin.id] = pluginsContexts[plugin.id] || {};

                        // Generate 'pluginContext' param.
                        args.push(pluginContext);

                        continue;
                    }

                    args.push(context[param]);
                }

                if (asyncMethod) {
                    // Mark async method launched.
                    // Sync methods never marked.
                    var usedPluginMethods = usedMethods[plugin.id] = usedMethods[plugin.id] || {};
                    usedPluginMethods[method] = (usedPluginMethods[method] || 0) + 1;
                }

                try {

                    // Call method.
                    handle.apply(plugin.module, args);

                } catch(ex) {

                    // Immediately stop method with error.
                    callback(ex);

                    if (!asyncMethod) {
                        // Prevent run sync callback again.
                        asyncMethod = true;

                    }
                }

                // Sync callback.
                if (!asyncMethod) {
                    callback();
                }

            })();
        }
    }

    function useResult(usedMethods, context, pluginsContexts, allResults, result, options, asyncMethodCb) {

        if (!result) {
            return false;
        }

        var hasNewData = false;

        for(var i = 0; i < result.length; i++) {

            var r = result[i];

            // Mark method finished.
            // Mark synced to asyncMethodCb call.
            var method = r.method;
            var usedPluginMethods = usedMethods[method.pluginId];
            usedPluginMethods[method.name] = 0;

            // Collect total result.
            allResults.allData.push(r);

            if (r.data && r.data.title && !context.title) {
                // Store title.
                context.title = r.data.title;
            }

            // Merge data to context.
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
                            hasNewData = true;
                        }
                    }

                } else if (r.method.name === "getMeta") {

                    // Extend unified meta.

                    for(var key in r.data) {
                        var v = r.data[key];

                        if (key === 'date') {
                            v = utils.unifyDate(v);
                        }

                        if (v !== '') {
                            allResults.meta[key] = v;
                            if (options.debug) {
                                allResults.meta._sources[key] = r.method.pluginId;
                            }
                        }
                    }
                }
            }
        }

        // After new context received - launch link post plugins.

        for(var i = 0; i < result.length; i++) {

            if (r.data && !r.error && r.method.name === 'getLink' || r.method.name === 'getLinks') {

                var links = r.data;
                if (!(links instanceof Array)) {
                    links = [links];
                }

                for(var j = 0; j < links.length; j++) {
                    var link = links[j];
                    allResults.links.push(link);
                    runPostPlugins(link, usedMethods, context, pluginsContexts, asyncMethodCb);
                }
            }
        }

        return hasNewData;
    }

    function resultsHasDomainData(allData) {
        var hasDomainData = false;
        for(var i = 0; i < allData.length && !hasDomainData; i++) {
            var r = allData[i];

            var plugin = plugins[r.method.pluginId];
            if (plugin.domain && r.data && !r.error) {
                hasDomainData = true;
            }
        }
        return hasDomainData;
    }

    /*
    * Run plugins to collect all possible data.
    * */
    function run(uri, options, cb) {

        var pluginsSet = getPluginsSet(uri, options);

        var requiredPlugins = pluginsSet.initialPlugins,
            pluginsUrlMatches = pluginsSet.pluginsUrlMatches,
            usedDomains = pluginsSet.usedDomains,

            // Initial context.
            context = {
                uri: uri,
                cb: true,
                options: options,
                whitelistRecord: options.whitelistRecord
            },

            pluginsContexts = {},

            allResults = {
                allData: [],
                links: [],
                meta: {}
            },
            usedMethods = {},

            // Mark initial context params as used.
            usedParams = {
                uri: true,
                cb: true,
                options: true,
                whitelistRecord: true
            },

            // Recursive callback to continue run available plugins
            asyncMethodCb = function(error, result) {

                console.log(' - call result:', result && result.map(function(r) {return r.method.pluginId;}).join(', '));

                // Gather results.
                var hasNewData = useResult(usedMethods, context, pluginsContexts, allResults, result, options, asyncMethodCb);

                // Run all available plugins again with new data.
                var hasRuns = 0;
                if (hasNewData || error === 'initial') {
                    hasRuns = runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb);
                }

                if (hasRuns === 0) {

                    // If no available mathods found - check if some async methods still running.
                    //console.log('has no runs', usedMethods);
                    for(var pluginId in usedMethods) {
                        var pluginMethods = usedMethods[pluginId];
                        for(var method in pluginMethods) {
                            var runs = pluginMethods[method];
                            if (runs) {
                                return;
                            }
                        }
                    }

                    // If no data from domain plugins - try fallback to generic plugins.
                    if (!options.mixAllWithDomainPlugin && usedDomains && !resultsHasDomainData(allResults.allData)) {

                        // Reload pluginsSet selecting only generic.
                        pluginsSet = getPluginsSet(uri, _.extend({}, options, {
                            useOnlyGenericPlugins: true
                        }));
                        requiredPlugins = pluginsSet.initialPlugins;
                        pluginsUrlMatches = pluginsSet.pluginsUrlMatches;
                        usedDomains = pluginsSet.usedDomains; // Will be null.

                        // Recursive call with same context to prevent same data fetching.
                        runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, asyncMethodCb);

                    } else {
                        // If no methods running - call finish callback.
                        cb(null, allResults);
                    }
                }
            };

        asyncMethodCb('initial');
    }

/*
    run('http://test.com', {}, function(error, result) {
        console.log(JSON.stringify(result, null, 4));
        console.log('FINISH');
    });

*/

    var big = ['htmlparser', 'readability', 'meta'];
    run('http://habrahabr.ru/post/197880/', {}, function(error, result) {
        result.allData.forEach(function(r) {
            console.log('---------------');
            console.log(r.method);
            console.log(r.time);

            big.forEach(function(d) {
                if (r.data && r.data[d]) {
                    r.data[d] = true;
                }
            });

            if (r.data)
                console.log(r.data);
            if (r.error)
                console.log('error:', r.error);
        });
        //console.log(JSON.stringify(result, null, 4));
        console.log('FINISH');
        console.log('');
    });


})(exports);