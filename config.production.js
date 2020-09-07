(function() {
  var config = {
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
