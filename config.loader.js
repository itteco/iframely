import iframelyConfig from './config.js';
// Load global config from exec dir, because `iframely` can be used as library.
var globalConfig = await import(process.cwd() + '/config.js');
globalConfig = globalConfig && globalConfig.default;
export default {...iframelyConfig, ...globalConfig};