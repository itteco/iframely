var globalConfig = await import(process.cwd() + '/config.js');
globalConfig = globalConfig && globalConfig.default;
export default globalConfig;