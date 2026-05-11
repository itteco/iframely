import * as core from './lib/core.js';
// Check what plugins are registered and what they provide
var pm = core.getPluginManager ? core.getPluginManager() : null;
console.log('pm:', !!pm);

// Try to trace execution
core.run('https://bigthink.com/series/the-big-think-interview/tiago-forte/', {debug: true, refresh: true, returnAllErrors: true}, function(err, result) {
    console.log('err:', JSON.stringify(err));
    var allData = result?.allData;
    console.log('allData length:', allData?.length);
    // Check if cachedMeta ran
    var cachedMeta = allData?.find(r => r.method?.pluginId === 'cachedmeta');
    console.log('cachedMeta entry:', JSON.stringify(cachedMeta));
    process.exit(0);
});
