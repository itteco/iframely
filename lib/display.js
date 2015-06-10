var _ = require('underscore');

module.exports = function (req, res) {
  var links = res.locals.links.links
    , player_link;

  player_link = _.find(links, function (link) {
    return _.contains(link.rel, CONFIG.R.player);
  });

  if (player_link) {
    var redirect_url = player_link.href + (player_link.href.indexOf ('?') > -1 ? "&": "?") + "autoplay=1";

    res.redirect(302, redirect_url);
  } else {
    var link = _.first(links);

    res.renderCached('embed-html.ejs', {
      title: link.title,
      html: link.html
    });
  }
};
