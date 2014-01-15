(function(core) {

    var utils = require('./utils');
    var pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict;

    var TIMER = true;

    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies.
     * */
    function findPluginMethods(pluginId, loadedParams, skipMethods, usedParams, result, mandatoryParams, mandatoryPlugins) {

        // Do not process plugin twice (if recursive dependency).
        if (pluginId in result || pluginId in skippedPlugins) {
            return;
        }

        var plugin = plugins[pluginId];

        // Register result array.
        result[plugin.id] = {
            methods: []
        };

        // Process all mixins.
        // TODO: make for loop.
        plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
            findPluginMethods(mixin, loadedParams, skipMethods, usedParams, result, mandatoryParams, mandatoryPlugins);
        });

        var skipPluginMethods = skipMethods[plugin.id];

        // Check each plugin method.
        // TODO: make for loop.
        utils.PLUGIN_METHODS.forEach(function(method) {
            if (method in plugin.methods) {

                // Skip used method.
                if (skipPluginMethods && skipPluginMethods.indexOf(method) > -1) {
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
                                findPluginMethods(plugin, loadedParams, skipMethods, usedParams, result, mandatoryParams, mandatoryPlugins);
                            });
                        }
                    });

                } else {

                    // Method will run, store in result set.
                    result[plugin.id].methods.push(method);
                }
            }
        });
    }

    function runMethods(methods, context, cb) {

        async.map(methods, function(method, cb) {

            var plugin = plugins[method.pluginId];

            var params = plugin.methods[method.name];

            var args = [];

            var methodTimer;
            if (TIMER) {
                methodTimer = utils.createTimer();
            }

            var callback = function(error, data) {

                if (data) {
                    for(var key in data) {
                        var v = data[key];
                        if (v == null || (typeof v === 'undefined') || (typeof v == 'number' && isNaN(v))) {
                            delete data[key];
                        }
                    }
                }

                if (error) {
                    console.error("Plugin error", plugin.id, method.name, error);
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
                    result.error = error;
                }

                // TODO: rerun plugins check.

                cb(null, result);
            };

            var cbUsed = false;

            params.forEach(function(param) {

                if (param === 'cb') {
                    cbUsed = true;
                    args.push(callback);
                    return;
                }

                // TODO: urlMatch depends on plugin.

                args.push(context[param]);
            });

            try {
                var result = method.handle.apply(plugin.module, args);
            } catch(ex) {
                if (!cbUsed) {
                    callback(ex);
                    cbUsed = true;
                }
            }

            if (!cbUsed) {
                callback(null, result);
            }
        }, cb);
    }

    function runPlugins(requiredPlugins, secondaryPlugins, context, usedMethods, usedParams, cb) {

        var loadedParams = _.keys(context);

        var mandatoryParams = _.difference(loadedParams, _.keys(usedParams));

        var methodsData = {};

        // TODO: make for loop.
        requiredPlugins.forEach(function(plugin) {
            findPluginMethods(plugin, loadedParams, usedMethods, usedParams, methodsData);
        });

        if (mandatoryParams && mandatoryParams.length > 0) {

            // TODO: how to rerun parser for late async plugin.

            // TODO: make for loop.
            secondaryPlugins.forEach(function(plugin) {
                findPluginMethods(plugin, loadedParams, usedMethods, usedParams, methodsData, mandatoryParams, requiredPlugins);
            });
        }

        var methods = [];

        for(var pluginId in methodsData) {
            var data = methodsData[pluginId];
            data.methods && data.methods.forEach(function(method) {

                var plugin = plugins[pluginId];
                methods.push({
                    pluginId: pluginId,
                    name: method,
                    handle: plugin.module[method],
                    parents: data.parents
                });
            });
        }

        runMethods(methods, context, cb);
    }



})(exports);