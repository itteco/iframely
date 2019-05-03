(function(core) {

    var _ = require('underscore'),
        request = require('request'),
        urlLib = require('url');

    var pluginUtils = require('./loader/utils'),
        utils = require('./utils'),
        sysUtils = require('../logging'),
        oembedUtils = require('./oembed'),
        pluginLoader = require('./loader/pluginLoader'),
        requestWrapper = require('./request');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict,
        pluginsList = pluginLoader._pluginsList,
        usedParamsDict = pluginLoader._usedParamsDict,
        postPluginsList = pluginLoader._postPluginsList,
        PLUGIN_METHODS = pluginUtils.PLUGIN_METHODS;



    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies (up and down by tree).
     * */
    function findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, usedDomains, mandatoryParams) {

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
                    findPluginMethods(mixins[i], loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, usedDomains);
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

                // If "__" super mandatory params are absent - skip plugin.
                var hasMandatoryParams = false;
                for(var j = 0; j < absentParams.length && !hasMandatoryParams; j++) {
                    var param = absentParams[j];
                    if (param.substr(0, 2) === "__") {
                        hasMandatoryParams = true;
                    }
                }
                if (hasMandatoryParams) {
                    continue;
                }

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

                    var pluginsId = findPluginsForAbsentParams(absentParams, usedDomains, usedParams);

                    // Find absent params in other plugins 'provides' attribute.
                    for(var j = 0; j < pluginsId.length; j++) {
                        var foundPluginId = pluginsId[j];
                        findPluginMethods(foundPluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, usedDomains);
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
    function runMethods(methods, context, pluginsUrlMatches, options, asyncMethodCb) {

        // Sync results list.
        var results = [];

        for(var i = 0; i < methods.length; i++) {
            (function() {

                var method = methods[i];

                var plugin = plugins[method.pluginId];

                var params = plugin.methods[method.name];

                var args = [];

                if (options.debug) {
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

                    if (options.debug) {
                        result.time = methodTimer();
                    }

                    if (error) {

                        if (error.code) {
                            var statusCode = error.code;
                            error = {};
                            error[SYS_ERRORS.responseStatusCode] = statusCode;
                        }

                        if (error instanceof Error) {
                            error = error.toString();
                        }

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
                            callback(SYS_ERRORS.timeout);
                        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);
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
    function runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, options, asyncMethodCb) {

        var loadedParams = _.keys(context);

        var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));

        // Reset scanned plugins for each iteration.
        var scannedPluginsIds = {};

        // Methods to run will be here.
        var methods = [];

        // Find methods in each required plugin.
        for(var i = 0; i < requiredPlugins.length; i++) {
            var plugin = requiredPlugins[i];
            findPluginMethods(plugin.id, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, usedDomains);
        }

        // If has new unused params (mandatoryParams) - then find plugins which can use them.
        if (mandatoryParams && mandatoryParams.length > 0) {

            var secondaryPlugins = findPluginsForMandatoryParams(mandatoryParams, usedDomains);

            // Find methods in plugins, which can use mandatory params.
            for(var i = 0; i < secondaryPlugins.length; i++) {
                var pluginId = secondaryPlugins[i];
                findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, usedDomains, mandatoryParams);
            }
        }

        // Run found methods.
        runMethods(methods, context, pluginsUrlMatches, options, asyncMethodCb);

        return methods.length;
    }

    function getPluginsSet(uri, options, usedParams) {

        var initialPlugins = [],
            usedDomains,
            isDomainPluginsMode = false,
            pluginsUrlMatches = {};

        if (options.fetchParam) {

            var paramPlugins = providedParamsDict[options.fetchParam];
            if (paramPlugins && paramPlugins.length) {

                // Store dependency param. Need to determine mandatory params in feature.
                usedParams[options.fetchParam] = true;

                for(var k = 0; k < paramPlugins.length; k++) {
                    var foundPluginId = paramPlugins[k];
                    initialPlugins.push(plugins[foundPluginId]);
                }
            }

        } else {

            var domain = uri.split('/')[2]
                // Skip www. for domain search.
                .replace(/^www\./i, "")
                .toLowerCase();

            var pluginMatchesByDomains = {};

            function registerDomainPlugin(plugin, match) {
                usedDomains = usedDomains || {};
                usedDomains[plugin.domain] = true;
                var domainPlugins = pluginMatchesByDomains[plugin.domain] = pluginMatchesByDomains[plugin.domain] || {};
                domainPlugins[plugin.id] = !!match;

                if (plugin.mixinAllGeneric) {
                    options.mixAllWithDomainPlugin = true;
                }
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
                        } else if (res.length) {
                            // Skip plugin with unmatched re.
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

                        if (idx > 0) {
                            var subdomain = domain.substring(0, idx - 1);
                            if (subdomain === 'blog') {
                                // Skip "blog.*.*" blog page for domain plugin without re.
                                continue;
                            }
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

                // Add all domain plugins without re.
                // Old: If no re match - use only non-re domain plugins.
                //if (matchedPluginsNames.length === 0) {
                    for(var pluginId in domainPlugins) {
                        var plugin = plugins[pluginId];
                        if (!plugin.re.length) {
                            matchedPluginsNames.push(pluginId);
                        }
                    }
                //}

                for(var i = 0; i < matchedPluginsNames.length; i++) {
                    var pluginId = matchedPluginsNames[i];
                    isDomainPluginsMode = true;
                    initialPlugins.push(plugins[pluginId]);
                }
            }

            // If not domain or no domain plugins - fill with generic.
            if (initialPlugins.length === 0) {
                addAllGeneric();
            }

            if (options.forceParams) {
                // TODO: replace forEach
                options.forceParams.forEach(function(param) {

                    var paramPlugins = providedParamsDict[param];
                    if (paramPlugins && paramPlugins.length) {

                        // Store dependency param. Need to determine mandatory params in feature.
                        usedParams[param] = true;

                        for(var k = 0; k < paramPlugins.length; k++) {
                            var foundPluginId = paramPlugins[k];

                            var exists = _.find(initialPlugins, function(plugin) {
                                return plugin.id === foundPluginId;
                            });
                            if (!exists) {
                                initialPlugins.push(plugins[foundPluginId]);
                            }
                        }
                    }
                });
            }
        }

        return {
            initialPlugins: initialPlugins,
            pluginsUrlMatches: pluginsUrlMatches,
            usedDomains: usedDomains,
            isDomainPluginsMode: isDomainPluginsMode
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
                    // Skip custom plugins.
                    if (!(pluginId in foundPluginsDict) && !plugin.custom && (!plugin.domain || (usedDomains && (plugin.domain in usedDomains)))) {
                        foundPluginsDict[pluginId] = true;
                        result.push(pluginId);
                    }
                }
            }
        }

        return result;
    }

    /*
    * Find plugins which can produce 'absentParams'.
    *
    * Find only generic plugins or plugins from matched domain.
    * */
    function findPluginsForAbsentParams(absentParams, usedDomains, usedParams) {

        var foundPluginsDict = {},
            result = [];

        for(var i = 0; i < absentParams.length; i++) {
            var param = absentParams[i];
            // Find absent params in other plugins 'provides' attribute.
            var paramPlugins = providedParamsDict[param];
            if (paramPlugins && paramPlugins.length) {
                for (var j = 0; j < paramPlugins.length; j++) {
                    var pluginId = paramPlugins[j];
                    var plugin = plugins[pluginId];
                    // Prevent duplicates.
                    // Find only generic plugins or plugins from matched domain.
                    if (!(pluginId in foundPluginsDict) && (!plugin.domain || (usedDomains && (plugin.domain in usedDomains)))) {
                        usedParams[param] = true;
                        foundPluginsDict[pluginId] = true;
                        result.push(pluginId);
                    }
                }
            }
        }

        return result;
    }

    function runPostPluginsIterationCall(methodName, iterationPluginContexts) {

        for(var i = 0; i < postPluginsList.length; i++) {
            (function() {

                var plugin = postPluginsList[i];
                var handle = plugin.module[methodName];


                if (!handle) {
                    return;
                }

                var iterationPluginContext = iterationPluginContexts[plugin.id] = iterationPluginContexts[plugin.id] || {};

                try {

                    handle.apply(plugin.module, [iterationPluginContext]);

                } catch(ex) {

                    console.error("   -- Post plugin error in", plugin.id + "." + methodName, ex);
                }

            })();
        }
    }

    function runPostPlugins(link, dataRecord, usedMethods, context, pluginsContexts, iterationPluginContexts, options, asyncMethodCb) {

        // Sync results list.
        var results = [];

        for(var i = 0; i < postPluginsList.length; i++) {
            (function() {

                // This will prevent lower priority plugins if previous _sync_ plugin placed link.error.
                if (link.error) {
                    return;
                }

                var plugin = postPluginsList[i];
                var method = {
                    pluginId: plugin.id,
                    name: 'prepareLink',
                    handle: plugin.module['prepareLink']
                };
                var params = plugin.methods[method.name];

                var args = [];

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

                    var result = {
                        method: method,
                        data: data
                    };

                    if (error) {
                        if (error instanceof Error) {
                            error = error.toString();
                        }
                        console.error("   -- Post plugin error in", plugin.id + "." + method.name, error);
                    }

                    if (asyncMethod) {

                        // Grant real async if callback was called before function return.
                        process.nextTick(function() {
                            // Call 'asyncMethodCb' only for async post plugin, because core must wait it.
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

                    } else if (param === 'link') {

                        // Generate 'link' param.
                        args.push(link);

                        continue;

                    } else if (param === 'pluginContext') {

                        var pluginContext = pluginsContexts[plugin.id] = pluginsContexts[plugin.id] || {};

                        // Generate 'pluginContext' param.
                        args.push(pluginContext);

                        continue;

                    } else if (param === 'iterationPluginContext') {

                        var iterationPluginContext = iterationPluginContexts[plugin.id] = iterationPluginContexts[plugin.id] || {};

                        // Generate 'pluginContext' param.
                        args.push(iterationPluginContext);

                        continue;

                    } else if (param === 'pluginId') {

                        args.push(dataRecord.method.pluginId);

                        continue;
                    }

                    args.push(context[param]);
                }

                var usedPluginMethods = usedMethods[plugin.id] = usedMethods[plugin.id] || {};
                usedPluginMethods[method.name] = (usedPluginMethods[method.name] || 0) + 1;

                try {

                    // TODO: check timeout for async method.
                    if (asyncMethod) {
                        timeout = setTimeout(function() {
                            // In case of async timeout - call 'callback' with error param.
                            callback(SYS_ERRORS.timeout);
                        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);
                    }

                    // Call method.
                    var result = method.handle.apply(plugin.module, args);

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

    function getResultErrorMessages(result, allResults) {

        if (!result) {
            return false;
        }

        for(var i = 0; i < result.length; i++) {
            var r = result[i];
            if (r.error) {
                // Get message from plugin error.
                useMessage(allResults, r.error);
            }
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
            usedPluginMethods[method.name] = usedPluginMethods[method.name] - 1;

            if (r.error) {
                // Too much error will be in log.
                //console.error("   -- Plugin error", method.pluginId, method.name, result.error);
            }

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

                        if (key === 'message') {

                            // Get message from plugin data.
                            useMessage(allResults, r.data);

                        } else {

                            // First data has priority, do not override it.
                            // whitelistRecord - exception for oembed plugin.
                            if (!(key in context) || key === 'whitelistRecord') {
                                context[key] = r.data[key];
                                hasNewData = true;
                            }
                        }
                    }

                } else if (r.method.name === "getMeta") {

                    // Extend unified meta.

                    for(var key in r.data) {
                        var v = r.data[key];

                        // TODO: postprocessing meta plugins.

                        if (key === 'date') {
                            v = utils.unifyDate(v);
                            if (!v) {
                                // Disable invalid date.
                                r.data[key] = v;
                            }
                        }

                        if (key === 'duration') {
                            v = utils.unifyDuration(v);
                            if (!v) {
                                // Disable invalid duration.
                                r.data[key] = v;
                            }
                        }

                        if (key === 'title' || key === 'canonical') {
                            if (v instanceof Array) {
                                v = v[0];
                            }
                        }

                        if (key === 'author' && v.match && v.match(/^https?:\/\//)) {
                            key = 'author_url';
                        }

                        if (v !== '' && v !== null && ((typeof v === 'string' && !/^\s+$/.test(v)) || typeof v === 'number')) {

                            // Check meta plugins order.
                            allResults.meta._sources = allResults.meta._sources || {};

                            var prevOrder = null, nextOrder = null, pluginId = allResults.meta._sources[key];

                            if (pluginId && plugins[pluginId] && plugins[r.method.pluginId]) {
                                prevOrder = plugins[pluginId].order;
                                nextOrder = plugins[r.method.pluginId].order;
                            }

                            if (!prevOrder || !nextOrder || prevOrder < nextOrder) {
                                allResults.meta[key] = v;
                                allResults.meta._sources[key] = r.method.pluginId;
                            }
                        }
                    }
                }
            }
        }

        // After new context received - launch link post plugins.

        for(var i = 0; i < result.length; i++) {

            var r = result[i];

            if (r.data && !r.error && r.method.name === 'getLink' || r.method.name === 'getLinks' || r.method.name === 'prepareLink') {

                var links;

                if (r.method.name === 'prepareLink') {
                    links = r.data && r.data.addLink;
                } else {
                    links = r.data;
                }

                if (!links) {
                    continue;
                }

                if (!(links instanceof Array)) {
                    links = [links];
                }

                links = _.compact(links);

                var iterationPluginContexts = {};

                runPostPluginsIterationCall('startIteration', iterationPluginContexts);

                for(var j = 0; j < links.length; j++) {
                    var link = links[j];
                    allResults.links.push(link);
                    runPostPlugins(link, r, usedMethods, context, pluginsContexts, iterationPluginContexts, options, asyncMethodCb);
                }

                runPostPluginsIterationCall('finishIteration', iterationPluginContexts);
            }
        }

        return hasNewData;
    }

    function useMessage(allResults, item) {
        var message = item.message;
        if (message && typeof message === 'string') {
            allResults.messages.push(message)
        }
    }

    function isEmpty(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    function resultsHasDomainData(requiredPlugins, allData) {

        var hasDomainData = false;

        // Mark required plugin without methods as it is have data.
        for(var i = 0; i < requiredPlugins.length && !hasDomainData; i++) {
            var plugin = requiredPlugins[i];

            // TODO: Optimize?
            if (isEmpty(plugin.methods)) {
                hasDomainData = true;
            }
        }

        // Check if some domain plugin returned some links.
        // Also see if getData returned safe_html.
        for(var i = 0; i < allData.length && !hasDomainData; i++) {
            var r = allData[i];
            var plugin = plugins[r.method.pluginId];
            if (plugin.domain && r.data && !r.error) {

                var hasGetLinkMethod = plugin.methods.getLink || plugin.methods.getLinks;
                var getLinkMethodUsed = r.method.name === 'getLink' || r.method.name === 'getLinks';

                if ((hasGetLinkMethod && getLinkMethodUsed)
                    || (r.method.name === 'getData' && r.data.safe_html)
                    || (!hasGetLinkMethod && r.method.name === 'getMeta')) {
                    hasDomainData = true;
                }
            }
        }

        return hasDomainData;
    }

    var BIG_CONTEXT = ['htmlparser', 'readability', 'decode'];

    function prepareResultData(uri, result, options) {

        if (!options.debug) {
            // TODO: deep clean?
            delete result.allData;
            delete result.meta._sources;
        }

        var links = result.links;

        if (!result.meta.canonical) {
            result.meta.canonical = uri;
        }

        // Remove canonical links.
        // Remove _meta data.
        var canonical = result.meta.canonical;
        if (canonical && canonical instanceof Array) {
            canonical = canonical[0];
        }

        if (result.meta.title === result.meta.description) {
            delete result.meta.description;
        }

        for(var i = 0; i < links.length;) {
            var link = links[i];

            // Remove canonical links.
            if (typeof canonical === 'string' && link.href && typeof link.href === 'string' && link.rel && link.rel.indexOf(CONFIG.R.file) === -1 && link.rel.indexOf(CONFIG.R.iframely) === -1) {

                // Remove last / from url.

                var link1 = link.href.replace(/\/+$/, '');
                var link2 = canonical.replace(/\/+$/, '');

                if (link1 === link2 && link.rel.indexOf(CONFIG.R.oembed) == -1) {
                    // allow the canonical links for oEmbeds, as such mistakes are usually made for OG and Twitter: 
                    // if publisher has oEmbed, he is most likely to have the valid embed codes
                    link.error = "Removed canonical link";
                }
            }

            if (!link.type && !link.error) {
                // Type can be loaded by async validator.
                // In case of timeout type will be empty.
                link.error = 'Link "type" required';
            }

            // Remove links with error.
            if (link.error) {
                links.splice(i, 1);
            } else {

                if (link.type && link.type.indexOf('video/') === 0) {
                    var autoplayIdx = link.rel.indexOf(CONFIG.R.autoplay);
                    if (autoplayIdx > -1) {
                        link.rel.splice(autoplayIdx, 1);
                    }
                }

                if (!result.meta.media && link.rel.indexOf(CONFIG.R.player) > -1) {
                    result.meta.media = 'player';
                }

                if (options.debug) {
                    link.sourceId = i;
                }

                if ('_imageMeta' in link || '_imageStatus' in link) {

                    var newLink;
                    if (options.debug) {
                        newLink = _.extend({}, link);
                    } else {
                        newLink = link;
                    }

                    delete newLink._imageMeta;
                    delete newLink._imageStatus;
                    links[i] = newLink;
                }

                i++;
            }

            // Get message from plugin link.
            useMessage(result, link);            
        }

        // Sort links.
        core.sortLinks(links);

        var allData = result.allData;
        if (allData) {
            for(var i = 0; i < allData.length; i++) {
                var r = allData[i];
                for(var j = 0; j < BIG_CONTEXT.length; j++) {
                    var d = BIG_CONTEXT[j];
                    if (r.data && r.data[d]) {
                        r.data[d] = 'BIG_CONTEXT';
                    }
                }
            }
        }

        if (options.debug && options.totalTimer) {
            result.time = {
                total: options.totalTimer()
            }
        }

        if (result.messages.length === 0) {
            delete result.messages;
        }
    }

    core.sortLinks = function(links) {

        // Sort links in order of REL according to CONFIG.REL_GROUPS.
        function getRelIndex(rel) {
            var rels = _.intersection(rel, CONFIG.REL_GROUPS);
            var gr = CONFIG.REL_GROUPS.length + 1;
            if (rels.length > 0) {
                for(var i = 0; i < rels.length; i++) {
                    // Find smallest index.
                    var idx = CONFIG.REL_GROUPS.indexOf(rels[i]);
                    if (idx < gr) {
                        gr = idx;
                    }
                }
            }
            return gr;
        }
        links.sort(function(l1, l2) {

            var groupDiff = getRelIndex(l1.rel) - getRelIndex(l2.rel);

            if (groupDiff !== 0) {
                return groupDiff;
            }

            var iframely1 = l1.rel.indexOf(CONFIG.R.iframely) > -1 ? 0 : 1;
            var iframely2 = l2.rel.indexOf(CONFIG.R.iframely) > -1 ? 0 : 1;

            if (iframely1 !== iframely2) {
                return iframely1 - iframely2;
            }

            var m1 = l1.media;
            var m2 = l2.media;
            if (m1 && m2) {

                if (m1.width && m2.width) {
                    // Bigger first.
                    return m2.width - m1.width;

                } else if (m1['aspect-ratio'] && !m2['aspect-ratio']) {
                    // Has aspect - first.
                    return -1;

                } else if (!m1['aspect-ratio'] && m2['aspect-ratio']) {
                    // Has aspect - first.
                    return 1;

                } else if (m1.width && !m2.width) {
                    // Has width - first.
                    return -1;

                } else if (!m1.width && m2.width) {
                    // Has width - first.
                    return 1;
                }

            } else if (m1 && !m2) {
                // Has media - first.
                return -1;

            } else if (!m1 && m2) {
                // Has media - first.
                return 1;
            }

            return 0;
        });
    };

    var SYS_ERRORS = {
        redirect: 'redirect',
        responseStatusCode: 'responseStatusCode',
        responseError: 'responseError',
        timeout: 'timeout'
    };

    function findRedirectError(result) {
        if (result) {
            for(var i = 0; i < result.length; i++) {
                var r = result[i];
                var redirect = r.error && r.error[SYS_ERRORS.redirect];
                if (typeof redirect === "string") {
                    sysUtils.log('   -- plugin redirect (by "' + r.method.pluginId + '")', redirect);
                    return redirect;
                } else if (redirect && typeof redirect !== "string") {
                    sysUtils.log('   -- skip plugin redirect, not string (by "' + r.method.pluginId + '")', redirect);
                }
            }
        }
    }

    function findResponseError(result, uri) {
        if (result) {
            for(var i = 0; i < result.length; i++) {
                var r = result[i];

                if (r.error && r.error[SYS_ERRORS.responseError]) {
                    var error = r.error[SYS_ERRORS.responseError];

                    // Message logic:
                    // error.message - if error is Error.
                    // error - if error is responseCode (from oembedError).
                    var message = error.message || error;
                    
                    sysUtils.log('   -- plugin response:', JSON.stringify({plugin: r.method.pluginId, response: message, uri: uri}));
                    return error;
                }

                if (r.error && r.error[SYS_ERRORS.responseStatusCode]) {
                    sysUtils.log('   -- plugin response:', JSON.stringify({plugin: r.method.pluginId, response: r.error[SYS_ERRORS.responseStatusCode], uri: uri}));
                    return r.error[SYS_ERRORS.responseStatusCode];
                }

                if (r.error && r.error === SYS_ERRORS.timeout) {
                    sysUtils.log('   -- plugin response:', JSON.stringify({plugin: r.method.pluginId, response: SYS_ERRORS.timeout, uri: uri}));
                    return SYS_ERRORS.timeout;
                }
            }
        }
    }

    function searchParamInObj(start, bits, obj) {

        if (start === bits.length) {
            return obj;
        }

        if (!obj || !obj.hasOwnProperty) {
            return;
        }

        var path = bits[start];
        while(!obj.hasOwnProperty(path) && start < (bits.length - 1)) {
            start++;
            path += '.' + bits[start];
        }

        if (obj.hasOwnProperty(path)) {
            return searchParamInObj(start + 1, bits, obj[path]);
        } else {
            return;
        }
    }

    function generateProviderOptionsFunc(options) {
        // Do not redefine getProviderOptions func.
        if (options.getProviderOptions && options.getRequestOptions) {
            return;
        }

        options.getProviderOptions = function(path, defaultValue) {
            var bits = path.split('.');

            var value = searchParamInObj(0, bits, options.providerOptions);

            if (_.isArray(value)) {

                // ok.

            } else if (typeof value === 'object') {

                // Result is object. Extend default settings with custom settings.
                var valueDefault = searchParamInObj(0, bits, CONFIG.providerOptions);
                value = _.extend({}, valueDefault, value);

            } else if (typeof value === 'undefined') {

                // Custom setting is undefined, get default.
                value = searchParamInObj(0, bits, CONFIG.providerOptions);
            }

            return typeof value !== 'undefined' ? value : defaultValue;
        };


        options.getRequestOptions = function(path, defaultValue) {
                         
            var alternatePath = path.replace(/[^.]+\./, '_.');
            return options.getProviderOptions(alternatePath, options.getProviderOptions(path, defaultValue));
        }        
    }

    function callbackWithErrorCode(code, options, cb) {
        var newApi = options.v === '1.3';
        if (newApi) {
            return cb({code: code});
        } else {
            return cb(code);
        }
    }

    /*
    * Run plugins to collect all possible data.
    * */
    var run = core.run = function(uri, options, cb) {

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        if (!options.jar) {
            options.jar = request.jar();
        }

        generateProviderOptionsFunc(options);

        if (options.redirectsCount && options.redirectsCount > (CONFIG.MAX_REDIRECTS || 4)) {
            callbackWithErrorCode('redirect loop', options, cb);
            return;
        }

        // Remove default :443 and :80 from uri.
        uri = uri
            .replace(/^(http:\/\/[^\/]+):80/, '$1')
            .replace(/^(https:\/\/[^\/]+):443/, '$1');

        // Mark initial context params as used.
        var usedParams = {
            title: true,
            url: true,
            cb: true,
            options: true,
            request: true,
            whitelistRecord: true
        };

        var domain = uri.split('/')[2];

        if (!domain) {
            callbackWithErrorCode('invalid url', options, cb);
            return;
        }

        uri = uri.replace(domain, domain.toLowerCase());

        var pluginsSet = getPluginsSet(uri, options, usedParams);

        if (options.debug && !options.totalTimer) {
            options.totalTimer = utils.createTimer();
        }

        function requestWrapperWithParams(options_from_plugin, callback) {
            // Override 'refresh' only if present from caller and not present in plugin.
            if (!('refresh' in options_from_plugin) && ('refresh' in options)) {
                options_from_plugin.refresh = options.refresh;
            }
            // Override plugin TTL if not set or more then in options.
            if (options.cache_ttl) {
                var plugin_ttl = options_from_plugin.ttl;
                if (!plugin_ttl || plugin_ttl > options.cache_ttl) {
                    options_from_plugin.ttl = options.cache_ttl
                }
            }

            requestWrapper(options_from_plugin, options, callback);
        }

        var requiredPlugins = pluginsSet.initialPlugins,
            pluginsUrlMatches = pluginsSet.pluginsUrlMatches,
            usedDomains = pluginsSet.usedDomains,
            isDomainPluginsMode = pluginsSet.isDomainPluginsMode,

            // Initial context.
            context = {
                url: uri,
                cb: true,
                options: options,
                request: requestWrapperWithParams
            },

            pluginsContexts = {},

            allResults = {
                meta: {},
                links: [],
                messages: [],
                allData: []
            },
            usedMethods = {},

            aborted = false,

            abortCurrentRequest = function() {
                if (context.htmlparser && context.htmlparser.request && !context.htmlparser.request.aborted) {
                    context.htmlparser.request.abort();
                }
            },

            finish = function() {

                abortCurrentRequest();

                // Prepare data.
                prepareResultData(uri, allResults, options);

                if (context.safe_html) {
                    allResults.safe_html = context.safe_html;
                }

                if (options.forceParams) {
                    for(var i = 0; i < options.forceParams.length; i++) {
                        var param = options.forceParams[i];
                        var value = context[param];
                        if (value) {
                            var c = allResults.context = allResults.context || {};
                            c[param] = value;
                        }
                    }
                }

                if (options.whitelist) {
                    allResults.whitelist = options.getWhitelistRecord && options.getWhitelistRecord(uri, {disableWildcard: true});
                }

                if (options.fetchParam) {
                    callbackWithErrorCode('param not found', options, cb);
                } else {
                    cb(null, allResults);
                }

                utils.sendLogToWhitelist(uri, context.meta, context.oembed, context.oembedLinks, context.whitelistRecord);
            },

            // Recursive callback to continue run available plugins
            asyncMethodCb = function(error, result) {

                if (aborted) {
                    return;
                }

                //if (result) {
                //    console.log(' - call result:', error, result && result.map(function(r) {return r.method.pluginId;}).join(', '));
                //}

                getResultErrorMessages(result, allResults);

                // Find redirect command.
                var redirect = findRedirectError(result);
                if (redirect) {
                    abortCurrentRequest();
                    if (!redirect.match(/^https?:\/\//)) {
                        redirect = urlLib.resolve(uri, redirect);
                    }
                    options.redirectsCount = (options.redirectsCount || 0) + 1;
                    options.redirectsHistory = options.redirectsHistory || [];
                    options.redirectsHistory.push(uri);
                    run(redirect, options, cb);
                    aborted = true;
                    return;
                }

                // Abort on error response code.
                var responseError = findResponseError(result, uri);
                if (responseError) {
                    abortCurrentRequest();
                    aborted = true;

                    // TODO: better check?
                    if (options.v === '1.3') {

                        var error = {};

                        if (responseError === SYS_ERRORS.timeout) {
                            // Iframely plugin timeout should not be http error.
                            error.code = SYS_ERRORS.timeout;
                        } else if (responseError.code && responseError.message) {
                            error.code = 'request error';
                            error.error = responseError;
                        } else {
                            error.code = 'http error';
                            error.responseCode = responseError;
                        }

                        if (allResults.messages.length) {
                            error.messages = allResults.messages;
                        }

                        return cb(error);

                    } else {
                        return cb(responseError);
                    }
                }

                // Gather results.
                var hasNewData = useResult(usedMethods, context, pluginsContexts, allResults, result, options, asyncMethodCb);

                if (options.fetchParam && options.fetchParam in context) {
                    abortCurrentRequest();
                    cb(null, context[options.fetchParam]);
                    aborted = true;
                    return;
                }

                // Run all available plugins again with new data.
                var hasRuns = 0;
                if (hasNewData || error === 'initial') {
                    hasRuns = runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, options, asyncMethodCb);
                }

                if (hasRuns === 0) {

                    // If no available mathods found - check if some async methods still running.
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
                    if (!options.mixAllWithDomainPlugin && isDomainPluginsMode && !resultsHasDomainData(requiredPlugins, allResults.allData)) {

                        sysUtils.log('   -- fallback from domain to generic', usedDomains);

                        // Reload pluginsSet selecting only generic.
                        pluginsSet = getPluginsSet(uri, _.extend({}, options, {
                            useOnlyGenericPlugins: true
                        }), usedParams);
                        requiredPlugins = pluginsSet.initialPlugins;
                        pluginsUrlMatches = pluginsSet.pluginsUrlMatches;
                        usedDomains = pluginsSet.usedDomains; // Will be null.
                        isDomainPluginsMode = pluginsSet.isDomainPluginsMode;

                        // Recursive call with same context to prevent same data fetching.
                        hasRuns = runPluginsIteration(requiredPlugins, context, pluginsUrlMatches, usedMethods, usedParams, usedDomains, options, asyncMethodCb);

                        if (hasRuns === 0) {
                            finish();
                        }

                    } else {
                        // If no methods running - call finish callback.
                        finish();
                    }
                }
            };

        if (options.promoUri) {
            context.__promoUri = options.promoUri;
        }

        if (options.getWhitelistRecord) {
            var whitelistRecord = options.getWhitelistRecord(uri);
            if (whitelistRecord) {
                context.whitelistRecord = whitelistRecord;
            }
        }

        if (options.getProviderOptions('readability.enabled') === true || options.readability) {
            context.__readabilityEnabled = true;
            // Prevent force load readability plugin.
            usedParams.__readabilityEnabled = true;
        }

        asyncMethodCb('initial');
    };

    exports.getPluginData = function(uri, param, getWhitelistRecord, cb) {
        run(uri, {
            fetchParam: param,
            getWhitelistRecord: getWhitelistRecord
        }, cb);
    };

    exports.getOembed = oembedUtils.getOembed;

})(exports);