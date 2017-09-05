var sysUtils = require('./utils');
var bodyParser = require('body-parser')

console.log("");
console.log("Starting Iframely...");
console.log("Base URL for embeds that require hosted renders:", CONFIG.baseAppUrl);

var path = require('path');
var express = require('express');
var jsonxml = require('jsontoxml');

var NotFound = sysUtils.NotFound;

var app = express();

app.set('view engine', 'ejs');

if (CONFIG.allowedOrigins) {
  app.use(function(req, res, next) {
    var origin = req.headers["origin"];

    if (origin) {
      if (CONFIG.allowedOrigins.indexOf('*') > -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else {
        if (CONFIG.allowedOrigins.indexOf(origin) > -1) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
      }
    }
    next();
  });
}
app.disable( 'x-powered-by' );
app.use(function(req, res, next) {
  res.setHeader('X-Powered-By', 'Iframely');
  next();
});
app.use(bodyParser.json());
app.use(sysUtils.cacheMiddleware);


require('./modules/api/views')(app);
require('./modules/debug/views')(app);
require('./modules/tests-ui/views')(app);

app.use(logErrors);
app.use(errorHandler);


function logErrors(err, req, res, next) {
  if (CONFIG.RICH_LOG_ENABLED) {
    console.error(err.stack);
  } else {
    console.log(err.message);
  }

  next(err);
}

var errors = [401, 403, 408];

function respondWithError(req, res, code, msg) {
  var err = {
    error: {
      source: 'iframely',
      code: code,
      message: msg
    }
  };

  var ttl;
  if (code === 404) {
    ttl = CONFIG.CACHE_TTL_PAGE_404;
  } else if (code === 408) {
    ttl = CONFIG.CACHE_TTL_PAGE_TIMEOUT;
  } else {
    ttl = CONFIG.CACHE_TTL_PAGE_OTHER_ERROR
  }

  if (req.query.format === 'xml') {

    var xmlError = jsonxml(err, {
      escape: true,
      xmlHeader: {
        standalone: true
      }
    });

    res.sendCached('text/xml', xmlError, {
      code: code,
      ttl: ttl
    });

  } else {

    res.sendJsonCached(err, {
      code: code,
      ttl: ttl
    });
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof NotFound) {
    respondWithError(req, res, 404, err.message);
  } else {
    var code = err.code || 500;
    errors.map(function(e) {
      if (err.message.indexOf(e) > - 1) {
        code = e;
      }
    });

    if (err.message.indexOf('timeout') > -1) {
      respondWithError(req, res, 408, 'Timeout');
    }
    else if (code === 401) {
      respondWithError(req, res, 401, 'Unauthorized');
    }
    else if (code === 403) {
      respondWithError(req, res, 403, 'Forbidden');
    }
    else if (code === 404) {
      respondWithError(req, res, 404, 'Not found');
    }
    else if (code === 410) {
      respondWithError(req, res, 410, 'Gone');
    }
    else if (code === 415) {
      respondWithError(req, res, 415, 'Unsupported Media Type');
    }
    else if (code === 417) {
      respondWithError(req, res, 417, 'Unsupported Media Type');
    }
    else {
      respondWithError(req, res, code, 'Server error');
    }
  }
}

process.on('uncaughtException', function(err) {
  if (CONFIG.DEBUG) {
    console.log(err.stack);
  } else {
    console.log(err.message);
  }
});

if (!CONFIG.DISABLE_SERVE_STATIC) {
  // This code not compatible with 'supertest' (in e2e.js)
  // Disabled for tests.
  app.use(CONFIG.relativeStaticUrl, express.static('static'));
}

app.get('/', function(req, res) {
  res.writeHead(302, { Location: 'http://iframely.com'});
  res.end();
});

process.title = "iframely";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = app;
