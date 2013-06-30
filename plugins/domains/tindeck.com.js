var URL = require("url");
module.exports = {
	re: [
		/^http:\/\/(?:www\.)?tindeck\.com\/listen\/([-_a-z0-9]+)\/?$/i
	],

	mixins: [
		"og-title",
		"og-site",
		"og-image"
	],

	getMeta: function(url, $selector) {
		var meta = {};
		var license_url = $selector('a[href^="http://creativecommons.org/licenses/"]').attr("href");
		var author = $selector('a[href^="/users/"]').first();

		if (license_url) {
			meta.license_url = URL.resolve(url, license_url);
		}

		if (author.length > 0) {
			meta.author = author.text();
			meta.author_url = URL.resolve(url, author.attr('href'));
		}

		return meta;
	},

	getLink: function(urlMatch) {
		return [{
			href: "http://tindeck.com/player/v1/player.swf?trackid="+urlMatch[1],
			type: CONFIG.T.flash,
			rel:  CONFIG.R.player,
			width:  466,
			height: 105
		}];
	},

	tests: [
		"http://tindeck.com/listen/pzgv",
		"http://tindeck.com/listen/qhml"
	]
};
