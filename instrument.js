// Optional instrumentation bootstrap. Import FIRST from an entry
// module (server.js / cluster.js).
//
// Deployment-injectable: when CONFIG.INSTRUMENT_MODULE names a module
// (resolvable in this install — e.g. linked in by the deployment) and
// that module exports initSentry(CONFIG), it is initialized and the
// SDK instance is exposed as `global.__Sentry` for the few call sites
// that can't import it (app.js logErrors). Plain installs configure
// nothing here and this file is a silent no-op.
import CONFIG from './config.loader.js';

if (CONFIG.INSTRUMENT_MODULE) {
    // .then(), not top-level await — TLA would make every importer's
    // graph async (`require()` consumers of the package would break).
    import(CONFIG.INSTRUMENT_MODULE).then((m) => {
        if (m.initSentry && m.initSentry(CONFIG)) {
            global.__Sentry = m.Sentry;
        }
    }).catch((e) => {
        console.log('INSTRUMENT_MODULE "' + CONFIG.INSTRUMENT_MODULE + '" failed to load: ' + e.message);
    });
}
