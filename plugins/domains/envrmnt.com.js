console.log("envrmnt.com loaded");

module.exports = {

    re: [
        /^https?:\/\/(?:cloud-)?www\.envrmnt\.com\/share\/\?share=([\w\-]+)\/([\w\-]+)\/?$/i
    ],

    getMeta: function(urlMatch) {
      return;
    },

    getLink: function(urlMatch) {
      var fullUrl = urlMatch[0];
      var videoId = urlMatch[2];
      var playerId = urlMatch[1];
      return {
        type: CONFIG.T.text_html,
        rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.html5],
        html: "<h1>Boom</h1>"
      };
    }
};