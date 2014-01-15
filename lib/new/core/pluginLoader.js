(function(pluginLoader) {

    var fs = require('fs'),
        path = require('path'),
        JSLINT = require('jslint'),
        _ = require('underscore'),
        async = require('async'),
        request = require('request'),
        jsdom = require('jsdom'),
        url = require('url'),
        moment = require('moment'),
        chokidar = require('chokidar');

    var utils = require('./utils');

    var PLUGIN_METHODS = utils.PLUGIN_METHODS,
        PLUGINS_FIELDS = utils.PLUGIN_FIELDS,
        PLUGIN_FIELDS_TYPE_DICT = utils.PLUGIN_FIELDS_TYPE_DICT;

    var plugins = pluginLoader._plugins = {},
        providedParamsDict = pluginLoader._providedParamsDict = {},
        templates = {},
        metaMappings = {},
        pluginsList;


    /*
     * ===================
     * Loading plugins
     * ===================
     * */


    function validateMixins() {
        for(var id in plugins) {

            var plugin = plugins[id];

            plugin.module.mixins && plugin.module.mixins.forEach(function(mixin) {
                if (!(mixin in plugins)) {
                    console.warn('Unexisting mixin "' + mixin + '" in plugin "' + id + '"');
                    delete plugins[id];
                }
            });
        }
    }

    /*
     * Check if all params required by plugins declared by 'provides' plugins field.
     * */
    function validateDependencies() {

        for(var id in plugins) {

            var plugin = plugins[id];

            // Check each plugin method.
            utils.PLUGIN_METHODS.forEach(function(method) {
                if (method in plugin.methods) {
                    var params = plugin.methods[method];

                    var absentParams = params.filter(function(param) {
                        if (param in {'uri':1,'cb':1,'urlMatch':1}) {
                            return false;
                        }
                        return !(param in providedParamsDict);
                    });

                    if (absentParams.length > 0) {
                        console.warn('Non-provided params: "' + absentParams.join(', ') + '" in plugin "' + id + '"');
                        delete plugins[id];
                    }
                }
            });
        }
    }

    function getFileName(filenameWithExt) {
        return filenameWithExt.replace(/\.(js|ejs)$/i, "");
    }

    function getPluginMethods(pluginPath,plugin) {
        var methods = {};
        for (var name in plugin) {
            var func = plugin[name];
            if (typeof func === "function" && PLUGIN_METHODS.indexOf(name) > -1) {
                JSLINT('('+String(func)+')', {node: true, sloppy: true, white: true, vars: true, maxerr: Infinity, forin: true});
                if (!JSLINT.tree.first) {
                    console.error('In file '+pluginPath+' in function exports.'+name+':');
                    JSLINT.data().errors.forEach(function (error) {
                        if (error) {
                            console.error(error.reason);
                            if (error.evidence) {
                                console.error(error.evidence+'\n');
                            }
                        }
                    });
                    throw new Error('JSLINT could not parse function');
                }
                methods[name] = JSLINT.tree.first[0].first.map(function (param) {
                    return param.string;
                });
            }
        }
        return methods;
    }

    function loadPluginFile(pluginPath) {

        var bits = pluginPath.split(path.sep);

        if (pluginPath.match(/\.js$/i)) {

            var plugin;
            var pluginDeclaration = {};

            // Load plugin.
            try {
                plugin = require(pluginPath);
            } catch(ex) {
                console.error("Error loading plugin", pluginPath, ex);
                return;
            }

            if (plugin.notPlugin) {
                // Skip utils modules.
                return;
            }

            // Check if have required method.
            var hasSign = _.some(PLUGINS_FIELDS, function(sign) {
                return sign in plugin;
            });
            if (!hasSign) {
                console.warn("No plugin methods in " + pluginPath + ". Insert exports.notPlugin = true; to skip this warning.");
                return;
            }

            // Check methods type.
            var error = false;
            PLUGINS_FIELDS.forEach(function(sign) {
                if (sign in plugin && sign in PLUGIN_FIELDS_TYPE_DICT) {
                    if (!(plugin[sign] instanceof PLUGIN_FIELDS_TYPE_DICT[sign])) {
                        console.error('Type error: "' + sign + '" must by instanceof "' + PLUGIN_FIELDS_TYPE_DICT[sign] + '" in', pluginPath);
                        error = true;
                    }
                }
            });
            if (error) {
                return;
            }

            // ID.
            pluginDeclaration.id = getFileName(bits[bits.length - 1]).toLowerCase();
            if (pluginDeclaration.id in plugins) {
                console.error("Duplicate plugin id (filename)", pluginPath);
                return;
            }

            // Normalize RE.
            if (plugin.re) {
                if (plugin.re instanceof RegExp) {
                    pluginDeclaration.re = [plugin.re];
                } else if (plugin.re instanceof Array) {

                    if (!_.every(plugin.re, function(re) { return re instanceof RegExp; })) {
                        console.error('Not RegExp in re of', pluginPath);
                        return;
                    }

                    pluginDeclaration.re = plugin.re;
                } else {
                    console.error('Not RegExp or Array in re of', pluginPath);
                    return;
                }
            } else {
                pluginDeclaration.re = [];
            }

            // Fill "plugin provides" dict.
            if (plugin.provides) {

                // Allow non arrays.
                var provides = plugin.provides instanceof Array ? plugin.provides : [plugin.provides];

                provides.forEach(function(param) {

                    if (param === 'self') {
                        // Convert 'self' to plugin id.
                        param = pluginDeclaration.id;
                    }

                    var list = providedParamsDict[param] = providedParamsDict[param] || [];
                    list.push(pluginDeclaration.id);
                });
            }

            // Find domain.
            var domainBitIdx = bits.indexOf('domains');
            if (domainBitIdx > -1) {
                // Domain plugin.
                var domain = bits[domainBitIdx + 1].replace(/^www\./i, "");
                // Remove .js extension if not folder.
                pluginDeclaration.domain = getFileName(domain);
            } else {
                if (plugin.re) {
                    console.warn("re in generic plugin (will never work)", pluginPath)
                }
            }

            // Find plugin methods params.
            pluginDeclaration.methods = getPluginMethods(pluginPath, plugin);
            for(var method in pluginDeclaration.methods) {
                if (!(method in plugin)) {
                    delete pluginDeclaration.methods[method];
                }
            }

            pluginDeclaration.module = plugin;

            pluginDeclaration.custom = bits.indexOf('custom') > -1;

            var stat = fs.statSync(pluginPath);
            pluginDeclaration.modified = new Date(stat.mtime);

            // Store plugin.
            plugins[pluginDeclaration.id] = pluginDeclaration;

        } else if (pluginPath.match(/\.ejs$/i)) {

            var id = getFileName(bits[bits.length - 1]).toLowerCase();

            if (id in templates) {
                console.error("Duplicate template id (filename)", pluginPath);
                return;
            }

            templates[id] = pluginPath;
        }
    }

    function loadPluginDir(pluginPath) {

        // Scan plugin dir.
        var plugins = fs.readdirSync(pluginPath);

        plugins.forEach(function(plugin_name) {
            var plugin = path.resolve(pluginPath, plugin_name);
            var stats = fs.statSync(plugin);

            if (stats.isFile()) {
                loadPluginFile(plugin);
            }
        });
    }

    function scanAllPluginsDir(modulePluginsPath) {

        // Scan mudule plugins.
        var plugins = fs.readdirSync(modulePluginsPath);

        plugins.forEach(function(plugin_name) {
            var plugin = path.resolve(modulePluginsPath, plugin_name);
            var stats = fs.statSync(plugin);

            if (stats.isFile()) {
                loadPluginFile(plugin);
            } if (stats.isDirectory()) {
                loadPluginDir(plugin);
            }
        });
    }

    function scanModulesForPlugins() {

        // Scan node_modules dir.
        var modulesRootPath = path.resolve('node_modules');
        var modules_listing = fs.readdirSync(modulesRootPath).map(function(module_name) { return path.resolve(modulesRootPath, module_name); });

        modules_listing.push(path.resolve('.'));

        modules_listing.forEach(function(modulePath) {

            var modulePackagePath = path.resolve(modulePath, 'package.json');

            if (fs.existsSync(modulePackagePath)) {

                // Scan plugins.

                var moduleInfo = require(modulePackagePath);
                if (!moduleInfo["iframely-proxy-plugins"]) {
                    return;
                }

                var modulePluginsPath = path.resolve(modulePath, 'lib', 'new', 'plugins');
                if (fs.existsSync(modulePluginsPath)) {
                    console.log(modulePluginsPath);
                    scanAllPluginsDir(modulePluginsPath);
                }

                var modulePluginsPath = path.resolve(modulePath, 'plugins', 'domains');
                if (fs.existsSync(modulePluginsPath)) {
                    scanAllPluginsDir(modulePluginsPath);
                }

                var modulePluginsPath = path.resolve(modulePath, 'plugins', 'generic');
                if (fs.existsSync(modulePluginsPath)) {
                    scanAllPluginsDir(modulePluginsPath);
                }

                var modulePluginsPath = path.resolve(modulePath, 'plugins', 'custom');
                if (fs.existsSync(modulePluginsPath)) {
                    scanAllPluginsDir(modulePluginsPath);
                }

                // Scan template plugins (just one more dir for organisation).
                var moduleTemplatePluginsPath = path.resolve(modulePath, 'plugins', 'templates');
                if (fs.existsSync(moduleTemplatePluginsPath)) {
                    scanAllPluginsDir(moduleTemplatePluginsPath);
                }
            }
        });

        validateMixins();
        validateDependencies();

        pluginsList = pluginLoader._pluginsList = _.values(plugins);

        console.log('Iframely plugins loaded:')
        console.log('   - custom domains:', pluginsList.filter(function(p) { return p.domain; }).length);
        console.log('   - generic & meta:', pluginsList.filter(function(p) { return !p.domain && !p.custom; }).length);

        // Low priority - goes first, second plugin will override values.
        pluginsList.sort(function(p1, p2) {

            function getV(p) {
                if (p.module.lowestPriority) {
                    return 0;
                }
                if (p.module.highestPriority) {
                    return 2;
                }
                return 1;
            }

            return getV(p1) - getV(p2);
        });

        // Get meta mappings.
        var metaMappingsNotSorted = {};
        var mappingsRe = /return \{\s*([^\}]+)\}/im;
        var mappingRe = /[\s\n]*"?([a-z0-9_-]+)"?\s*:\s*([^\n]+)[\s\n]*,?[\s\n]*/img;
        pluginsList.forEach(function(p) {
            if (p.module.getMeta) {
                var func = p.module.getMeta.toString();
                var mappingsMatch = func.match(mappingsRe);
                if (mappingsMatch) {
                    var mappingStr = mappingsMatch[1];
                    var mappingMatch;
                    while (mappingMatch = mappingRe.exec(mappingStr)) {
                        var key = mappingMatch[1];
                        var source = mappingMatch[2];

                        source = source.replace(/,?[\s\n]*$/gi, "");

                        var sources = metaMappingsNotSorted[key] = metaMappingsNotSorted[key] || [];
                        sources.push({
                            source: source,
                            pluginId: p.id
                        });
                    }
                }
            }
        });

        var keys = _.keys(metaMappingsNotSorted);
        keys.sort();
        keys.forEach(function(key) {
            metaMappings[key] = metaMappingsNotSorted[key];
        });
    }

    scanModulesForPlugins();

})(exports);