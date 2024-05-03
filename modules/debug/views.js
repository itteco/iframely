import { getProviderOptionsQuery } from '../api/utils.js';
import escape from '../../lib/escape'

export default function(app) {

    app.get('/debug', function(req, res, next) {

        var DEBUG = CONFIG.DEBUG;

        if ("debug" in req.query) {
            DEBUG = {"on":1, "true":1}[req.query.debug];
        }

        res.render('debug',{
            uri: escape(req.query.uri),
            mixAllWithDomainPlugin: !!{"on":1, "true":1}[req.query.mixAllWithDomainPlugin],
            refresh: !!{"on":1, "true":1}[req.query.refresh],
            DEBUG: DEBUG,
            QUERY: getProviderOptionsQuery(escape(req.query))
        });
    });
};