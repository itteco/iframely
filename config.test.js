(function() {

  var config = {

    DEBUG: true,
    RICH_LOG_ENABLED: true,

    baseAppUrl: "https://localhost",
    port: 8080,

    RESPONSE_TIMEOUT: 1 * 100, //ms

    BLACKLIST_DOMAINS_RE: /blacklisted.*/
  };

  module.exports = config;
})();