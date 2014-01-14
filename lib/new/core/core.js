(function(core) {

    var utils = require('./utils');
    var pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins,
        providedParamsDict = pluginLoader._providedParamsDict;

    var TIMER = true;

    /*
     * Recursively finds plugin methods to run, including 'mixins' and dependencies.
     * */
    function findPluginMethods(plugin, loadedParams, mandatoryParams, skipMethods, usedParams, result) {

        // Do not process plugin twice (if recursive dependency).
        if (plugin.id in result || plugin.id in skippedPlugins) {
            return;
        }

        // Register result array.
        result[plugin.id] = {
            methods: []
        };

        // Process all mixins.
        // TODO: make for loop.
        plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
            findPluginMethods(plugins[mixin], loadedParams, mandatoryParams, skipMethods, usedParams, result);
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
                                findPluginMethods(plugins[plugin], loadedParams, mandatoryParams, skipMethods, usedParams, result);
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

    function runPlugins(requiredPlugins, context, usedMethods, usedParams, cb) {

        var loadedParams = _.keys(context);

        var mandatoryParams = false;

        // TODO: do always?
        if (false) {
            mandatoryParams = _.difference(loadedParams, _.keys(usedParams));
        }

        var methodsData = {};

        requiredPlugins.forEach(function(plugin) {
            findPluginMethods(plugin, loadedParams, false, usedMethods, usedParams, methodsData);
        });

        if (mandatoryParams) {
            // TODO: Store added plugins to base list.

            // TODO: how to rerun parser for late async plugin.

            var genericPlugins = [];
            genericPlugins.forEach(function(plugin) {
                findPluginMethods(plugin, loadedParams, mandatoryParams, usedMethods, usedParams, methodsData);
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