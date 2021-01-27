var sysUtils = require("../utils");
var app = require("../app");

var server = app.listen(
  process.env.PORT || CONFIG.port,
  process.env.HOST || CONFIG.host,
  function () {
    console.log(
      "\niframely is running on " +
        server.address().address +
        ":" +
        server.address().port
    );
    console.log("API endpoints: /oembed and /iframely; Debugger UI: /debug\n");
  }
);

if (CONFIG.ssl) {
  require("https").createServer(CONFIG.ssl, app).listen(CONFIG.ssl.port);
}

console.log("");
console.log(" - support@iframely.com - if you need help");
console.log(" - twitter.com/iframely - news & updates");
console.log(" - github.com/itteco/iframely - star & contribute");

if (!CONFIG.DEBUG) {
  var GracefulServer = require("graceful-cluster").GracefulServer;
  new GracefulServer({
    server: server,
    log: sysUtils.log,
    shutdownTimeout: CONFIG.SHUTDOWN_TIMEOUT,
  });
}

module.exports = server;
