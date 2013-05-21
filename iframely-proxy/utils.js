(function() {

    function NotFound(message) {

        if (typeof message === 'object') {
            this.meta = message;
            message = JSON.stringify(message, null, 4);
        }

        Error.call(this); //super constructor
        Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

        this.name = this.constructor.name; //set our function’s name as error name.
        this.message = message; //set the error message

    };

    NotFound.prototype.__proto__ = Error.prototype;

    exports.NotFound = NotFound;

    var send = require('send')
        , utils = require('connect/lib/utils')
        , parse = utils.parseUrl
        , url = require('url');


    exports.static = function(root, options){
        options = options || {};

        // root required
        if (!root) throw new Error('static() root path required');

        // default redirect
        var redirect = false !== options.redirect;

        return function static(req, res, next) {
            if ('GET' != req.method && 'HEAD' != req.method) return next();
            var path = parse(options.path ? {url: options.path} : req).pathname;
            var pause = utils.pause(req);

            function resume() {
                next();
                pause.resume();
            }

            function directory() {
                if (!redirect) return resume();
                var pathname = url.parse(req.originalUrl).pathname;
                res.statusCode = 301;
                res.setHeader('Location', pathname + '/');
                res.end('Redirecting to ' + utils.escape(pathname) + '/');
            }

            function error(err) {
                if (404 == err.status) return resume();
                next(err);
            }

            send(req, path)
                .maxage(options.maxAge || 0)
                .root(root)
                .hidden(options.hidden)
                .on('error', error)
                .on('directory', directory)
                .pipe(res);
        };
    };

})();
