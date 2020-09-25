(function() {
  var config = {
    CACHE_ENGINE: 'no-cache',
    allowedOrigins: ["*"],
    baseAppUrl: "https://iframely.blackbaud.services",
    providerOptions: {
      locale: "en_US",
      twitch: {
        parent: 'blackbaud-sites.com,blackbaud.services'
      }
    }
  };

  module.exports = config;
})();
