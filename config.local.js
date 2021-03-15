(function() {
    var config = {
        ADD_OEMBED_PARAMS: [{
          re: [
              /^https:\/\/graph\.facebook\.com\/v\d+\.\d+\/instagram_oembed/i,
              /^https:\/\/graph\.facebook\.com\/v\d+\.\d+\/oembed_/i
          ],
          params: {
              access_token: process.env.OEMBED_ACCESS_TOKEN
          },
          allowedOrigins: [
              "*.pri.org",
              "*-pri9.pantheonsite.io",
              "pri9.lndo.site"
          ]
        }]
    };

    module.exports = config;
})();
