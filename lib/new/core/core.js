(function(core) {

    var _ = require('underscore');

    var utils = require('./utils'),
        pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict,
        pluginsList = pluginLoader._pluginsList;

    var TIMER = false;

    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies.
     * */
    function findPluginMethods(pluginId, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, mandatoryPlugins) {

        // Do not process plugin twice (if recursive dependency).
        if (pluginId in scannedPluginsIds) {
            return;
        }

        var plugin = plugins[pluginId];

        // Register result array.
        scannedPluginsIds[plugin.id] = true;

        // Process all mixins.
        // TODO: make for loop.
        plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
            findPluginMethods(mixin, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, mandatoryPlugins);
        });

        var usedPluginMethods = usedMethods[plugin.id] = usedMethods[plugin.id] || {};

        // Check each plugin method.
        // TODO: make for loop.
        utils.PLUGIN_METHODS.forEach(function(method) {
            if (method in plugin.methods) {

                // Skip used method.
                if (usedPluginMethods && (method in usedPluginMethods)) {
                    return;
                }

                var params = plugin.methods[method];

                // Skip method if its not using mandatory params.
                if (mandatoryParams && mandatoryParams.length > 0) {
                    if (_.intersection(params, mandatoryParams).length == 0) {
                        return;
                    } else if (mandatoryPlugins && mandatoryPlugins.indexOf(pluginId) == -1) {
                        mandatoryPlugins.push(pluginId);
                    }
                }

                var absentParams = _.difference(params, loadedParams);

                // ulrMatch workaround.
                // Each plugin can have own match, or no match at all.
                var urlMatchParamIdx = absentParams.indexOf('urlMatch');
                if (urlMatchParamIdx > -1) {
                    if (pluginsUrlMatches[pluginId]) {
                        absentParams.splice(urlMatchParamIdx, 1);
                    } else {
                        // Skip method with 'urlMatch' required. Match not found for that plugin.
                        return;
                    }
                }

                if (absentParams.length > 0) {

                    // Find absent params in other plugins 'provides' attribute.
                    // TODO: make for loop.
                    absentParams.forEach(function(param) {
                        var plugins = providedParamsDict[param];
                        if (plugins) {

                            // Store dependency param. Need to determine mandatory params in feature.
                            usedParams[param] = true;

                            // TODO: make for loop.
                            plugins.forEach(function(plugin) {
                                findPluginMethods(plugin, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, mandatoryPlugins);
                            });
                        }
                    });

                } else {

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
        });
    }


    function runMethods(methods, context, pluginsUrlMatches, usedMethods, asyncMethodCb) {

        var results = [];

        // TODO: make for loop.
        methods.forEach(function(method) {

            var plugin = plugins[method.pluginId];

            var params = plugin.methods[method.name];

            var args = [];

            var methodTimer;
            if (TIMER) {
                methodTimer = utils.createTimer();
            }

            var asyncMethod = false;

            params.forEach(function(param) {

                if (param === 'cb') {

                    // Generate callback param.

                    asyncMethod = true;
                    args.push(callback);
                    return;

                } else if (param === 'urlMatch') {

                    // Generate 'urlMatch' param depending on plugin.

                    args.push(pluginsUrlMatches[method.pluginId]);
                    return;
                }

                args.push(context[param]);
            });

            var callback = function(error, data) {

                // Mark method finished.
                var usedPluginMethods = usedMethods[plugin.id];
                usedPluginMethods[method.name] = true;

                // TODO: move to context processing.
                if (data) {
                    for(var key in data) {
                        var v = data[key];
                        if (v == null || (typeof v === 'undefined') || (typeof v === 'number' && isNaN(v))) {
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
                    asyncMethodCb(null, [result]);
                } else {
                    results.push(result);
                }
            };

            try {
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
        });

        asyncMethodCb(null, results);
    }

    var counter = 0;

    function runPlugins(requiredPlugins, secondaryPlugins, context, pluginsUrlMatches, usedMethods, usedParams, asyncMethodCb) {

        counter++;
        if (counter > 13) {
            return;
        }

        var loadedParams = _.keys(context);

        var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));

        var scannedPluginsIds = {};
        var methods = [];

        // TODO: make for loop.
        requiredPlugins.forEach(function(plugin) {
            findPluginMethods(plugin.id, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds);
        });

        if (mandatoryParams && mandatoryParams.length > 0) {

            // TODO: how to rerun parser for late async plugin.

            // TODO: make for loop.
            secondaryPlugins.forEach(function(plugin) {
                findPluginMethods(plugin.id, loadedParams, pluginsUrlMatches, usedMethods, usedParams, methods, scannedPluginsIds, mandatoryParams, requiredPlugins);
            });
        }

        runMethods(methods, context, pluginsUrlMatches, usedMethods, asyncMethodCb);

        return methods.length > 0;
    }

    function getPluginsSet(uri, options) {

        var domain = uri.split('/')[2].replace(/^www\./i, "").toLowerCase();

        var initialPlugins = [],
            secondaryPlugins = [],
            pluginsUrlMatches = {};

        var pluginMatchesByDomains = {};

        function registerDomainPlugin(plugin, match) {
            var domainPlugins = pluginMatchesByDomains[plugin.domain] = pluginMatchesByDomains[plugin.domain] || {};
            domainPlugins[plugin.id] = !!match;
        }

        // TODO: make for loop.
        pluginsList.forEach(function(plugin) {

            if (plugin.domain) {

                // Match only by regexp. Used in specific cases where domain changes (like national domain).

                var re = _.find(plugin.re, function(re) {
                    return uri.match(re);
                });
                if (re) {
                    // Store match for plugin.
                    var match = uri.match(re);
                    registerDomainPlugin(plugin, match);
                    pluginsUrlMatches[plugin.id] = match;
                    return;
                }

                // Straight match by domain.

                // Positive match on plugin.domain="domain.com", domain="sub.domain.com"
                // Positive match on plugin.domain="domain.com", domain="domain.com"
                var idx = domain.indexOf(plugin.domain);

                if (idx == -1 || ((idx > 0) && domain.charAt(idx - 1) != '.')) {
                    // Break if not found, or not dot separation.
                    return;
                }

                var match = (idx + plugin.domain.length) == domain.length;

                if (match) {
                    registerDomainPlugin(plugin, null);
                }
            }
        });

        function addAllGeneric() {
            // Use all generic plugins.
            pluginsList.forEach(function(plugin) {
                if (!plugin.domain && !plugin.custom) {
                    initialPlugins.push(plugin);
                }
            });
        }

        // In domain debug: add all plugins before domain plugins to make them low priority.
        if (options.mixAllWithDomainPlugin) {
            addAllGeneric();
        }

        for(var domain in pluginMatchesByDomains) {
            var domainPlugins = pluginMatchesByDomains[domain];

            var matchedPluginsNames = [];

            // Find domain plugins with re match.
            for(var plugin in domainPlugins) {
                var match = domainPlugins[plugin];
                if (match) {
                    matchedPluginsNames.push(plugin);
                }
            }

            // If no re match - use all domain plugins.
            if (matchedPluginsNames.length == 0) {
                matchedPluginsNames = _.keys(domainPlugins);
            }

            matchedPluginsNames.forEach(function(pluginId) {
                initialPlugins.push(plugins[pluginId]);
            });
        }

        // If not domain or no domain plugins - fill with generic.
        if (initialPlugins.length == 0) {
            addAllGeneric();
        }

        // Use all except other domains as plugins for unknown result params (aka mandatory params).
        pluginsList.forEach(function(p) {
            if (!p.domain || p.domain in pluginsUrlMatches) {
                secondaryPlugins.push(p);
            }
        });

        return {
            initialPlugins: initialPlugins,
            secondaryPlugins: secondaryPlugins,
            pluginsUrlMatches: pluginsUrlMatches
        };
    }

    function useResult(context, allResults, result) {

        // TODO: forloop.
        result.forEach(function(r) {

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

                    var newKeys = _.keys(r.data);

                    newKeys.forEach(function(key) {
                        // First data has priority, do not override it.
                        if (!(key in context)) {
                            context[key] = r.data[key];
                        }
                    });
                }
            }

        });
    }

    function run(uri, options, cb) {

        var pluginsSet = getPluginsSet(uri, options);

        var requiredPlugins = pluginsSet.initialPlugins,
            secondaryPlugins = pluginsSet.secondaryPlugins,
            pluginsUrlMatches = pluginsSet.pluginsUrlMatches,

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

                var hasRuns = runPlugins(requiredPlugins, secondaryPlugins, context, pluginsUrlMatches, usedMethods, usedParams, asyncMethodCb);

                if (!hasRuns) {
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

        runPlugins(requiredPlugins, secondaryPlugins, context, pluginsUrlMatches, usedMethods, usedParams, asyncMethodCb);
    }

    run('http://test.com', {}, function(error, result) {
        //console.log(JSON.stringify(result, null, 4));
    });


})(exports);