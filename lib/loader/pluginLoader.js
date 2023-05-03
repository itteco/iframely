
    import * as fs from 'fs';
    import * as path from 'path';
    import * as node_jslint from 'jslint';
    import { readFile } from 'fs/promises';
    var JSLINT = node_jslint.load('latest');
    import * as utils from './utils.js';

    import CONFIG from '../../config.loader.js';
    // Global CONFIG used by plugins loaded during module import.
    global.CONFIG = CONFIG;

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const iframelyDir = path.resolve(__dirname, '../../');

    var PLUGIN_METHODS = utils.PLUGIN_METHODS,
        PLUGINS_FIELDS = utils.PLUGIN_FIELDS,
        PLUGIN_FIELDS_TYPE_DICT = utils.PLUGIN_FIELDS_TYPE_DICT,
        POST_PLUGIN_DEFAULT_PARAMS = utils.POST_PLUGIN_DEFAULT_PARAMS,
        DEFAULT_PARAMS = utils.DEFAULT_PARAMS;

    
    const plugins = {},
        pluginsModules = {},
        providedParamsDict = {},
        usedParamsDict = {},
        templates = {},
        metaMappings = {},
        pluginsList = [],
        postPluginsList = [],
        pluginsByDomain = {};
    
    var pluginsListSortedByModifiedTime;

    export {
        plugins as _plugins,
        pluginsModules as _pluginsModules,
        providedParamsDict as _providedParamsDict,
        usedParamsDict as _usedParamsDict,
        templates as _templates,
        pluginsList as _pluginsList,
        postPluginsList as _postPluginsList,
        pluginsListSortedByModifiedTime as _pluginsListSortedByModifiedTime
    };

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
                    console.warn('Invalid mixin "' + mixin + '" in plugin "' + id + '"');
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
                        // TODO: move to config.

                        // TODO: check startIteration and finishIteration in post plugins.

                        if (DEFAULT_PARAMS.indexOf(param) > -1) {
                            return false;
                        } else if (method === 'prepareLink' && POST_PLUGIN_DEFAULT_PARAMS.indexOf(param) > -1) {
                            return false;
                        }
                        return !(param in providedParamsDict);
                    });

                    if (absentParams.length > 0) {
                        console.warn('No matching getData for params: "' + absentParams.join(', ') + '" in plugin "' + id + '"');
                    }
                }
            });
        }
    }

    function validateReDependency(re_plugin_id, from_plugin_id) {
        return true;
    }

    function validateReDependencies() {
        for(var id in plugins) {
            var plugin = plugins[id];
            if (typeof plugin.re === 'string') {
                if (!validateReDependency(plugin.re, id)) {
                    console.error('Invalid string re plugin reference for', id, plugin.re);
                }
            } else if (plugin.re instanceof RegExp) {
                // Ok.
            } else if (plugin.re instanceof Array) {
                plugin.re.forEach(re => {
                    if (typeof re === 'string') {
                        if (!validateReDependency(re, id)) {
                            console.error('Invalid string re plugin reference for', id, re);
                        }
                    } else if (re instanceof RegExp) {
                        // Ok.
                    } else {
                        console.error('Invalid value in Array of re for', id, re);
                    }
                });
            } else {
                console.error('Invalid value in re for', id, plugin.re);
                return;
            }
        }
    }

    function fillModifiedDate() {
        for(var i = 0; i < pluginsList.length; i++) {
            var plugin = pluginsList[i];
            plugin.modifiedWithMixins = plugin.getPluginLastModifiedDate();
        }

        pluginsListSortedByModifiedTime = [...pluginsList];
        pluginsListSortedByModifiedTime.sort((p1, p2) => {
            // Sort desc by modified date.
            return p2.modifiedWithMixins - p1.modifiedWithMixins;
        });
    }

    function getFileName(filenameWithExt) {
        return filenameWithExt.replace(/\.(js|ejs)$/i, "");
    }

    function getPluginMethods(pluginPath, plugin) {
        var methods = {};
        for (var name in plugin) {
            var func = plugin[name];
            if (typeof func === "function" && PLUGIN_METHODS.indexOf(name) > -1) {

                var funcString = String(func);

                if (CONFIG.DEBUG) {
                    // Test code with JSLint only in debug mode.

                    JSLINT('('+funcString+')', {
                        node: true, 
                        sloppy: true, 
                        white: true, 
                        vars: true, 
                        maxerr: Infinity, 
                        forin: true
                    });
                    // TODO: better way to detect error.
                    // TODO: show all jslint warnings? find better validation params.
                    var data = JSLINT.data();
                    if (data.errors) {
                        console.error('In file ' + pluginPath + ' in function exports. ' + name + ':');   
                        data.errors && data.errors.forEach(function (error) {
                            if (error) {
                                console.error(error.reason);
                                if (error.evidence) {
                                    console.error(error.evidence+'\n');
                                }
                            }
                        });
                        throw new Error('JSLINT could not parse function');
                    }
                }

                var m = funcString.match(/function\s*\(([^)]*)\)/);
                if (m) {
                    var paramsStr = m[1].trim();
                    var params = paramsStr ? paramsStr.split(/[, ]+/) : [];
                    methods[name] = params;
                }
            }
        }
        return methods;
    }

    async function loadPluginFile(pluginPath) {

        const relativePluginPath = pluginPath.replace(iframelyDir, '');

        var bits = relativePluginPath.split(path.sep);

        if (pluginPath.match(/\.js$/i)) {

            var plugin;
            var pluginDeclaration = {};
            var notPlugin = false;

            var pluginLoadTimeout = setTimeout(() => {
                console.error("-- Error: Timeout loading plugin " + pluginPath + ". Maybe recurring dependency.");
            }, 1000);

            // Load plugin.
            try {
                plugin = await import(pluginPath);
                clearTimeout(pluginLoadTimeout);
                if (plugin.notPlugin) {
                    notPlugin = true;
                }
                plugin = plugin && plugin.default;
            } catch(ex) {
                console.error("Error loading plugin", pluginPath, ex);
                clearTimeout(pluginLoadTimeout);
                return;
            }

            if (notPlugin || plugin.notPlugin) {
                // Skip utils modules.
                return;
            }

            // Check if have required method.
            var hasSign = PLUGINS_FIELDS.some(sign => sign in plugin);
            if (!hasSign) {
                console.warn("No plugin methods in " + pluginPath + ". Add exports.notPlugin = true; to skip this warning.");
                return;
            }

            // Check methods type.
            var error = false;
            PLUGINS_FIELDS.forEach(function(sign) {
                if (sign in plugin && sign in PLUGIN_FIELDS_TYPE_DICT) {
                    if (!(plugin[sign] instanceof PLUGIN_FIELDS_TYPE_DICT[sign])) {
                        console.error('Type error: "' + sign + '" must be instanceof "' + PLUGIN_FIELDS_TYPE_DICT[sign] + '" in', pluginPath);
                        error = true;
                    }
                }
            });
            if (error) {
                return;
            }

            // Check post plugin.
            // TODO: only prapereLink method abailable.
            // TODO: exclude prapereLink method from other plugins.
            pluginDeclaration.post = bits.indexOf('validators') > -1;
            if (pluginDeclaration.post) {
                if (!('prepareLink' in plugin)) {
                    console.error('Type error: "prepareLink" method absent in post plugin', pluginPath);
                    return;
                }
            }

            // ID.
            pluginDeclaration.id = getFileName(bits[bits.length - 1]).toLowerCase();
            if (pluginDeclaration.id in plugins) {
                if (CONFIG.CUSTOM_PLUGINS_PATH && pluginPath.indexOf(CONFIG.CUSTOM_PLUGINS_PATH) > -1) {
                    console.error("Plugin '" + pluginDeclaration.id + "' overridden by", pluginPath);
                    delete plugins[pluginDeclaration.id]
                } else {
                    console.error("Duplicate plugin id (filename)", pluginPath);
                    return;
                }
            }

            // Normalize RE.
            if (plugin.re) {
                if (plugin.re instanceof Array) {
                    pluginDeclaration.re = plugin.re;
                } else {
                    pluginDeclaration.re = [plugin.re];
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
                // Store in pluginsByDomain dict to fast search by domain.
                pluginsByDomain[pluginDeclaration.domain] = pluginDeclaration;
            } else {
                if (plugin.re) {
                    console.warn("re in generic plugin (will never be called)", pluginPath)
                }
            }

            // Find plugin methods params.
            pluginDeclaration.methods = getPluginMethods(pluginPath, plugin);
            for(var method in pluginDeclaration.methods) {
                if (!(method in plugin)) {
                    delete pluginDeclaration.methods[method];
                } else {
                    // Store dict with all plugins params.
                    var params = pluginDeclaration.methods[method];
                    params.forEach(function(param) {
                        var list = usedParamsDict[param] = usedParamsDict[param] || [];
                        list.push(pluginDeclaration.id);
                    });
                }
            }

            pluginDeclaration.module = plugin;

            // Plugins in folder 'custom' or 'core' will be run only on explicit dependency.
            pluginDeclaration.custom = (bits.indexOf('custom') > -1 || bits.indexOf('system') > -1) && !plugin.generic;

            var stat = fs.statSync(pluginPath);
            pluginDeclaration.modified = new Date(stat.mtime);
            pluginDeclaration.getPluginLastModifiedDate = getPluginLastModifiedDate;
            pluginDeclaration.pluginMatchesUrl = pluginMatchesUrl;

            // If no mixins - mark domain plugin 'asks to mixin all generic plugins'.
            if (plugin.mixins) {
                var idx = plugin.mixins.indexOf('*');
                if (idx > -1) {
                    // Remove '*' from array.
                    plugin.mixins.splice(idx, 1);
                    pluginDeclaration.mixinAllGeneric = true;
                }
            }

            if ('listed' in plugin) {
                pluginDeclaration.listed = plugin.listed;
            }

            // Store plugin.
            plugins[pluginDeclaration.id] = pluginDeclaration;
            pluginsModules[pluginDeclaration.id] = pluginDeclaration.module;

        } else if (pluginPath.match(/\.ejs$/i)) {

            var id = getFileName(bits[bits.length - 1]).toLowerCase();

            if (id in templates) {
                if (CONFIG.CUSTOM_PLUGINS_PATH && pluginPath.indexOf(CONFIG.CUSTOM_PLUGINS_PATH) > -1) {
                    console.error("Template '" + id + "' overridden by", pluginPath);
                    delete templates[id]
                } else {
                    console.error("Duplicate template id (filename)", pluginPath);
                    return;
                }
            }

            templates[id] = pluginPath;
        }
    }

    // Plugin method. Finds modified date, including mixins.
    function getPluginLastModifiedDate() {

        var plugin = this;

        var modified = plugin.modified;

        var mixins = plugin.module.mixins;

        if (mixins) {
            for(var i = 0; i < mixins.length; i++) {

                var mixin = mixins[i];
                if (plugins[mixin]) {
                    var m = plugins[mixin].getPluginLastModifiedDate();

                    if (m > modified) {
                        modified = m;
                    }
                }
            }
        }

        return modified;
    }

    async function loadPluginDir(pluginPath) {

        // Scan plugin dir.
        var plugins = fs.readdirSync(pluginPath);

        for (const plugin_name of plugins) {
            var plugin = path.resolve(pluginPath, plugin_name);
            var stats = fs.statSync(plugin);

            if (stats.isFile()) {
                await loadPluginFile(plugin);
            }
        };
    }

    async function scanAllPluginsDir(modulePluginsPath) {

        // Scan mudule plugins.
        var plugins = fs.readdirSync(modulePluginsPath);

        for (const plugin_name of plugins) {
            var plugin = path.resolve(modulePluginsPath, plugin_name);
            var stats = fs.statSync(plugin);

            if (stats.isFile()) {
                await loadPluginFile(plugin);
            } if (stats.isDirectory()) {
                await loadPluginDir(plugin);
            }
        };
    }

    function extractDomain(uri) {
        var m = uri.match(/^(?:https?:\/\/)?([^/?]+)/i);
        if (m) {
            return m[1];
        } else {
            return null;
        }
    }

    function extractDomainPatterns(uri) {

        var patterns = [];

        var domain = extractDomain(uri);
        if (!domain) {
            return patterns;
        }

        // Only full domain exact match.
        patterns.push(domain);

        // 'www' workaround.
        var bits = domain.split('.');
        if (bits[0] != 'www') {
            patterns.push('www.' + domain);
        } else {
            // Remove www.
            bits.splice(0, 1);
            domain = bits.join('.');
            patterns.push(domain);
        }

        return patterns;
    }

    export function findDomainPlugin(uri) {
        var patterns = extractDomainPatterns(uri);

        var record, i = 0;
        while(!record && i < patterns.length) {
            record = pluginsByDomain[patterns[i]];
            i++;
        }

        return record;
    };

    export function getDomainForPlugin(uri) {
        return uri && uri.split('/')[2]
            // Skip www. for domain search.
            .replace(/^www\./i, "")
            // Skip tailing ? for `domain.com?query`
            .replace(/\?.*$/i, "")
            .toLowerCase();
    }

    export function hasNewPluginForUri(timeAfter, uri) {
        if (!uri) {
            return;
        }

        if (typeof timeAfter !== 'number') {
            return;
        }

        var i = 0,
            plugin, match;

        const domain = getDomainForPlugin(uri);

        while (i < pluginsListSortedByModifiedTime.length
                && (plugin = pluginsListSortedByModifiedTime[i])
                // Dot not check next plugins if older, because they are all older (SortedByModifiedTime desc).
                && plugin.modifiedWithMixins > timeAfter
                // Find first plugin match (newest).
                && !(match = plugin.pluginMatchesUrl(domain, uri))) {

                    i++;
        }

        // Return plugin if match found.
        return match && plugin;
    };

    function pluginMatchesUrl(domain, uri) {
        if (!uri || !domain) {
            return;
        }

        const plugin = this;
        if (plugin.domain) {

            // Match only by regexp. Used in specific cases where domain changes (like national domain).

            var match = null, j = 0, res = plugin.re;
            while (!match && j < res.length) {
                match = uri.match(res[j]);
                j++;
            }
            if (match) {
                // Store match for plugin.
                return match;
            } else if (res.length) {
                // Skip plugin with unmatched re.
                return;
            }

            // Straight match by domain.

            // Positive match on plugin.domain="domain.com", domain="sub.domain.com"
            // Positive match on plugin.domain="domain.com", domain="domain.com"
            var idx = domain.indexOf(plugin.domain);

            if (idx === -1 || ((idx > 0) && domain.charAt(idx - 1) !== '.')) {
                // Break if not found, or not dot separation.
                return;
            }

            if (idx > 0) {
                var subdomain = domain.substring(0, idx - 1);
                if (subdomain === 'blog') {
                    // Skip "blog.*.*" blog page for domain plugin without re.
                    return;
                }
            }

            var match = (idx + plugin.domain.length) === domain.length;

            if (match) {
                // TODO: use `true` as `null`.
                return true;
            }
        }
    }

    async function scanModulesForPlugins() {

        // Scan node_modules dir.
        var modulesRootPath = path.resolve('node_modules');
        var modules_listing = fs.readdirSync(modulesRootPath).map(function(module_name) { return path.resolve(modulesRootPath, module_name); });

        modules_listing.push(path.resolve('.'));

        for (const modulePath of modules_listing) {

            var modulePackagePath = path.resolve(modulePath, 'package.json');

            if (fs.existsSync(modulePackagePath)) {

                // Scan plugins.

                
                const moduleInfo = JSON.parse(await readFile(new URL(modulePackagePath, import.meta.url)));

                if (!moduleInfo["iframely-proxy-plugins"]) {
                    continue;
                }

                async function loadPlugins() {
                    var bits = Array.prototype.slice.call(arguments, 0);
                    bits.splice(0, 0, modulePath);
                    var modulePluginsPath = path.resolve.apply(path.resolve, bits);
                    if (fs.existsSync(modulePluginsPath)) {
                        await scanAllPluginsDir(modulePluginsPath);
                    }
                }

                await loadPlugins('plugins', 'domains');
                await loadPlugins('plugins', 'custom');
                await loadPlugins('plugins', 'links');
                await loadPlugins('plugins', 'meta');
                await loadPlugins('plugins', 'templates');

                // TODO: if has multiple modules_listing - CUSTOM_PLUGINS_PATH will be loaded multiple times.
                if (CONFIG.CUSTOM_PLUGINS_PATH) {
                    if (fs.existsSync(CONFIG.CUSTOM_PLUGINS_PATH)) {
                        await loadPlugins(CONFIG.CUSTOM_PLUGINS_PATH, 'domains');
                        await loadPlugins(CONFIG.CUSTOM_PLUGINS_PATH, 'custom');
                        await loadPlugins(CONFIG.CUSTOM_PLUGINS_PATH, 'links');
                        await loadPlugins(CONFIG.CUSTOM_PLUGINS_PATH, 'meta');
                        await loadPlugins(CONFIG.CUSTOM_PLUGINS_PATH, 'templates');
                    } else {
                        console.warn('Custom plugin folder "' + CONFIG.CUSTOM_PLUGINS_PATH + '" not found.');
                    }
                }

                await loadPlugins('lib', 'plugins', 'system');
                await loadPlugins('lib', 'plugins', 'validators');
            }
        }

        validateMixins();
        validateDependencies();
        validateReDependencies();

        for (var pluginId in plugins) {
            var plugin = plugins[pluginId];
            if (plugin.post) {
                postPluginsList.push(plugin);
            } else {
                pluginsList.push(plugin);
            }
        }

        fillModifiedDate();

        console.log('Iframely plugins loaded:')
        console.log('   - custom domains:', pluginsList.filter(function(p) { return p.domain; }).length);
        console.log('   - generic & meta:', pluginsList.filter(function(p) { return !p.domain && !p.custom; }).length);

        // Low priority - goes first, second plugin will override values.
        pluginsList.sort(function(p1, p2) {

            function getV(p) {

                // Make domain plugins higher priority.
                if (p.domain) {

                    if (p.module.highestPriority) {
                        return 5;
                    }
    
                    if (p.module.lowestPriority) {
                        return 3;
                    }

                    return 4;

                } else {

                    if (p.module.highestPriority) {
                        return 2;
                    }
    
                    if (p.module.lowestPriority) {
                        return 0;
                    }

                    return 1;
                }
            }

            return getV(p1) - getV(p2);
        });

        // Sort post plugins by name.
        postPluginsList.sort(function(p1, p2) {
            return p1.id < p2.id ? -1: 1;
        });

        // Get meta mappings.
        // Create plugins order.
        var metaMappingsNotSorted = {};
        var mappingsRe = /return \{\s*([^\}]+)\}/im;
        var mappingRe = /[\s\n]*"?([a-z0-9_-]+)"?\s*:\s*([^\n]+)[\s\n]*,?[\s\n]*/img;
        pluginsList.forEach(function(p, idx) {
            p.order = idx + 1; // Not 0.
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

        var keys = Object.keys(metaMappingsNotSorted);
        keys.sort();
        keys.forEach(function(key) {
            metaMappings[key] = metaMappingsNotSorted[key];
        });
    }

    await scanModulesForPlugins();

