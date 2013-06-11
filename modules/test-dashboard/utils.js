var _ = require('underscore');

var iframely = require("../../lib/iframely");

exports.getPluginUnusedMethods = function(pluginId, debugData) {

    var usedMethods = getAllUsedMethods(debugData);
    var pluginMethods = findAllPluginMethods(pluginId, debugData.plugins);

    return _.difference(pluginMethods, usedMethods);
}

function getAllUsedMethods(debugData) {

    var result = [];

    // Collect all meta sources.
    for(var metaKey in debugData.meta._sources) {
        findUsedMethods({findByMeta: metaKey}, debugData, result);
    }

    // Collect all links sources
    debugData.links.forEach(function(link) {
        findUsedMethods({link: link}, debugData, result);
    });

    return result;
}

function findAllPluginMethods(pluginId, plugins, result) {

    result = result || [];

    var plugin = plugins[pluginId];

    plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
        findAllPluginMethods(mixin, plugins, result);
    });

    iframely.PLUGIN_METHODS.forEach(function(method) {
        if (method in plugin.methods) {
            result.push(pluginId + " - " + method);
        }
    });

    return result;
}

function findUsedMethods(options, debugData, result) {

    // Find debug data for specific link.

    var defaultContext = debugData.debug[0] && debugData.debug[0].context;
    defaultContext.request = true;
    defaultContext.$selector = true;

    result = result || [];

    debugData.debug.forEach(function(level, levelIdx) {
        if (options.maxLevel <= levelIdx) {
            return;
        }
        level.data.forEach(function(methodData) {

            if (!methodData.data) {
                return;
            }

            var resultData = methodData.data;
            if (!(resultData instanceof Array)) {
                resultData = [resultData];
            }

            resultData.forEach(function(l) {

                var good = false;
                if (options.link) {
                    good = l.sourceId == options.link.sourceId;
                }

                if (options.findByMeta) {
                    var s = debugData.meta._sources[options.findByMeta];
                    good = s.pluginId == methodData.method.pluginId && s.method == methodData.method.name;
                }

                if (options.findByData) {
                    good = _.intersection(_.keys(l), options.findByData).length > 0;
                }

                if (good) {

                    var methodId = methodData.method.pluginId + " - " + methodData.method.name;

                    var exists = result.indexOf(methodId) > -1
                    if (exists) {
                        return
                    }

                    result.push(methodId);

                    var params = debugData.plugins[methodData.method.pluginId].methods[methodData.method.name];

                    // Find parent data source.

                    var findSourceForRequirements = _.difference(params, defaultContext);

                    if (findSourceForRequirements.length > 0) {
                        findUsedMethods({
                            maxLevel: levelIdx,
                            findByData: findSourceForRequirements
                        }, debugData, result);
                    }
                }
            });
        });
    });

    return result;
}