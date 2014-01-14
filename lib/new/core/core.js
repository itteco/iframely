(function(core) {

    var utils = require('./utils');
    var pluginLoader = require('./pluginLoader');

    var plugins = pluginLoader._plugins;

    /*
    * Finds next methods to run.
    * */
    function findNextPluginsMethods(requiredPlugins, loadedParamsNames, calledMethods) {

    }

    /*
    * Recursively finds plugin methods to run, including 'mixins' and dependencies.
    * */
    function findPluginMethods(plugin, loadedParamsNames, result) {

        // Do not process plugin twice (if recursive dependency).
        if (plugin.id in result) {
            return;
        }

        // Register result array.
        result[plugin.id] = {
            methods: []
        };

        // Process all mixins.
        plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
            findPluginMethods(plugins[mixin], loadedParamsNames, result);
        });

        // Check each plugin method.
        utils.PLUGIN_METHODS.forEach(function(method) {
            if (method in plugin.methods) {
                var params = plugin.methods[method];

                var absentParams = _.difference(params, loadedParamsNames);

                // TODO: find plugins by mandatory params, for unknown target.

//                if (mandatoryRequirements) {
//                    if (_.intersection(params, mandatoryRequirements).length == 0) {
//                        return;
//                    }
//                }

                if (absentParams.length > 0) {

                    // TODO: Find dependencies.

                } else {

                    // Store all suitable methods by available requirements.
                    result[plugin.id].methods.push(method);

                    // Store required params.
                    result._allRequirements = _.union(result._allRequirements, params);
                }

            }
        });
    }

    // ===

    function _findSuitablePluginMethods(plugin, availableRequirements, mandatoryRequirements, result, parents) {

        if (plugin.id in result) {
            return;
        }

        function methodParamsLoaded(params, loadedParams) {
            return _.difference(params, loadedParams).length == 0;
        }

        // Register result array.
        result[plugin.id] = {
            methods: [],
            parents: parents
        };

        var newParents = (parents || []).concat(plugin.id);

        plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
            _findSuitablePluginMethods(plugins[mixin], availableRequirements, mandatoryRequirements, result, newParents);
        });

        PLUGIN_METHODS.forEach(function(method) {
            if (method in plugin.methods) {
                var params = plugin.methods[method];
                if (methodParamsLoaded(params, availableRequirements)) {

                    if (mandatoryRequirements) {
                        if (_.intersection(params, mandatoryRequirements).length == 0) {
                            return;
                        }
                    }

                    // Store all suitable methods by available requirements.
                    result[plugin.id].methods.push(method);
                    // Store required params.
                    result._allRequirements = _.union(result._allRequirements, params);
                }
            }
        });
    }

    function findSuitableMethods(pluginsList, loadedParams, mandatoryRequirements) {
        var result = {
            _allRequirements: []
        };
        pluginsList.forEach(function(plugin) {
            _findSuitablePluginMethods(plugin, availableRequirements, mandatoryRequirements, result);
        });
        return result;
    }

})(exports);