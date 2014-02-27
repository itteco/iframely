(function(core) {

    var _ = require('underscore'),
        request = require('request'),
        urlLib = require('url');

    var pluginUtils = require('./loader/utils'),
        utils = require('./utils'),
        pluginLoader = require('./loader/pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict,
        pluginsList = pluginLoader._pluginsList,
        usedParamsDict = pluginLoader._usedParamsDict,
        postPluginsList = pluginLoader._postPluginsList,
        PLUGIN_METHODS = pluginUtils.PLUGIN_METHODS;

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

                    // Find absent params in other plugins 'provides' attribute.
                    for(var j = 0; j < absentParams.length; j++) {
                        var param = absentParams[j];
                        var paramPlugins = providedParamsDict[param];
                        if (paramPlugins && paramPlugins.length) {

                            // Store dependency param. Need to determine mandatory params in feature.
                            usedParams[param] = true;

                            for(var k = 0; k < paramPlugins.length; k++) {
                                var foundPluginId = paramPlugins[k];
                                findPluginMethods(foundPluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
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
                            callback('timeout');
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
        runMethods(methods, context, pluginsUrlMatches, options, asyncMethodCb);

        return methods.length;
    }

    function getPluginsSet(uri, options, usedParams) {

        var initialPlugins = [],
            usedDomains,
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

            var domain = uri.split('/')[2].replace(/^www\./i, "").toLowerCase();

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

    function runPostPlugins(link, dataRecord, usedMethods, context, pluginsContexts, asyncMethodCb) {

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
                        console.error("   -- Post plugin error in", plugin.id + "." + method, error);
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

                    } else if (param === 'pluginId') {

                        args.push(dataRecord.method.pluginId);

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

            if (result.error) {
                console.error("   -- Plugin error", method.pluginId, method.name, result.error);
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
                                allResults.meta._sources = allResults.meta._sources || {};
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

            if (r.data && !r.error && r.method.name === 'getLink' || r.method.name === 'getLinks') {

                var links = r.data;

                if (!links) {
                    continue;
                }

                if (!(links instanceof Array)) {
                    links = [links];
                }

                for(var j = 0; j < links.length; j++) {
                    var link = links[j];
                    allResults.links.push(link);
                    runPostPlugins(link, r, usedMethods, context, pluginsContexts, asyncMethodCb);
                }
            }
        }

        return hasNewData;
    }

    function isEmpty(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    function resultsHasDomainData(requiredPlugins, allData) {

        var hasDomainData = false;

        for(var i = 0; i < requiredPlugins.length && !hasDomainData; i++) {
            var plugin = requiredPlugins[i];
            // If not methods in plugin - also mark as has data.

            // TODO: Optimize?
            if (isEmpty(plugin.methods)) {
                hasDomainData = true;
            }
        }

        for(var i = 0; i < allData.length && !hasDomainData; i++) {
            var r = allData[i];

            var plugin = plugins[r.method.pluginId];

            if (plugin.domain && r.data && !r.error) {
                hasDomainData = true;
            }
        }

        return hasDomainData;
    }

    var BIG_CONTEXT = ['htmlparser', 'readability'];

    function prepareResultData(result, options) {

        if (!options.debug) {
            // TODO: deep clean?
            delete result.allData;
        }

        var links = result.links;

        // Remove canonical links.
        // Remove _meta data.
        var canonical = result.meta.canonical;

        for(var i = 0; i < links.length;) {
            var link = links[i];

            // Remove canonical links.
            if (canonical && link.href === canonical) {
                link.error = "Removed canonical link";
            }

            // Remove links with error.
            if (link.error) {
                links.splice(i, 1);
            } else {

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
        }

        // Sort links.

        // Sort links in order of REL according to CONFIG.REL_GROUPS.
        function getRelIndex(rel) {
            var rels = _.intersection(rel, CONFIG.REL_GROUPS);
            var gr;
            if (rels.length > 0) {
                gr = CONFIG.REL_GROUPS.indexOf(rels[0]);
            } else {
                gr = CONFIG.REL_GROUPS.length + 1;
            }
            return gr;
        }
        links.sort(function(l1, l2) {
            var groupDiff = getRelIndex(l1.rel) - getRelIndex(l2.rel);

            if (groupDiff != 0) {
                return groupDiff;
            }

            var iframely1 = l1.rel.indexOf(CONFIG.R.iframely) > -1 ? 0 : 1;
            var iframely2 = l2.rel.indexOf(CONFIG.R.iframely) > -1 ? 0 : 1;

            return iframely1 - iframely2;
        });

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
    }

    var SYS_ERRORS = {
        redirect: 'redirect',
        responseStatusCode: 'responseStatusCode'
    };

    function findRedirectError(result) {
        if (result) {
            for(var i = 0; i < result.length; i++) {
                var r = result[i];
                if (r.error && r.error[SYS_ERRORS.redirect]) {
                    console.error('   -- plugin redirect (by "' + r.method.pluginId + '")', r.error[SYS_ERRORS.redirect]);
                    return r.error[SYS_ERRORS.redirect];
                }
            }
        }
    }

    function findResponseStatusCode(result) {
        if (result) {
            for(var i = 0; i < result.length; i++) {
                var r = result[i];
                if (r.error && r.error[SYS_ERRORS.responseStatusCode]) {
                    console.error('   -- response (by "' + r.method.pluginId + '")', r.error[SYS_ERRORS.responseStatusCode]);
                    return r.error[SYS_ERRORS.responseStatusCode];
                }
            }
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

        if (options.redirectsCount && options.redirectsCount > 3) {
            return cb('redirect loop');
        }

        // Mark initial context params as used.
        var usedParams = {
            title: true,
            url: true,
            cb: true,
            options: true,
            request: true,
            whitelistRecord: true
        };

        var pluginsSet = getPluginsSet(uri, options, usedParams);

        if (options.debug && !options.totalTimer) {
            options.totalTimer = utils.createTimer();
        }

        var requiredPlugins = pluginsSet.initialPlugins,
            pluginsUrlMatches = pluginsSet.pluginsUrlMatches,
            usedDomains = pluginsSet.usedDomains,

            // Initial context.
            context = {
                url: uri,
                cb: true,
                options: options,
                request: request,
                whitelistRecord: options.getWhitelistRecord && options.getWhitelistRecord(uri)
            },

            pluginsContexts = {},

            allResults = {
                meta: {},
                links: [],
                allData: []
            },
            usedMethods = {},

            aborted = false,

            finish = function() {

                // Abort request.
                if (context.htmlparser && context.htmlparser.request) {
                    context.htmlparser.request.abort();
                }

                // Prepare data.
                prepareResultData(allResults, options);

                if (context.safe_html) {
                    allResults.safe_html = context.safe_html;
                }

                if (options.forceParams) {
                    // TODO: replace forEach
                    options.forceParams.forEach(function(param) {
                        var value = context[param];
                        if (value) {
                            var c = allResults.context = allResults.context || {};
                            c[param] = value;
                        }
                    });
                }

                if (options.whitelist) {
                    allResults.whitelist = context.whitelistRecord;
                }

                if (options.fetchParam) {
                    cb('param not found');
                } else {
                    cb(null, allResults);
                }
            },

            // Recursive callback to continue run available plugins
            asyncMethodCb = function(error, result) {

                if (aborted) {
                    return;
                }

                // Find redirect command.
                var redirect = findRedirectError(result);
                if (redirect) {
                    if (!redirect.match(/^(https?:)?\/\//)) {
                        redirect = urlLib.resolve(uri, redirect);
                    }
                    options.redirectsCount = (options.redirectsCount || 0) + 1;
                    run(redirect, options, cb);
                    aborted = true;
                    return;
                }

                // Abort on error response code.
                var errorResponseCode = findResponseStatusCode(result);
                if (errorResponseCode) {
                    aborted = true;
                    return cb(errorResponseCode);
                }

                // Gather results.
                var hasNewData = useResult(usedMethods, context, pluginsContexts, allResults, result, options, asyncMethodCb);

                if (options.fetchParam && options.fetchParam in context) {
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
                    if (!options.mixAllWithDomainPlugin && usedDomains && !resultsHasDomainData(requiredPlugins, allResults.allData)) {

                        console.log('   -- fallback from domain to generic', usedDomains);

                        // Reload pluginsSet selecting only generic.
                        pluginsSet = getPluginsSet(uri, _.extend({}, options, {
                            useOnlyGenericPlugins: true
                        }));
                        requiredPlugins = pluginsSet.initialPlugins;
                        pluginsUrlMatches = pluginsSet.pluginsUrlMatches;
                        usedDomains = pluginsSet.usedDomains; // Will be null.

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

        asyncMethodCb('initial');
    };

    exports.getPluginData = function(uri, param, cb) {
        run(uri, {
            fetchParam: param
        }, cb);
    };


})(exports);