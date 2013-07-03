var URL = require("url");

var LayerMap = {
	M: 'mapnik',
	C: 'cyclemap',
	T: 'transportmap',
	Q: 'mapquest'
};

function sinh(x) {
	return (Math.exp(x) - Math.exp(-x)) / 2;
}

// See: http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_bbox
function getTileNumber(lat, lon, zoom) {
	var n = Math.pow(2, zoom);
	var xtile = Math.floor((lon + 180) / 360 * n);
	var ytile = (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) +
	            1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n));
	return [xtile, ytile];
}

function getLonLat(xtile, ytile, zoom) {
	var n = Math.pow(2, zoom);
	var lon = xtile / n * 360 - 180;
	var lat = Math.atan(sinh(Math.PI * (1 - 2 * ytile / n))) / Math.PI * 180;
	return [lon, lat];
}

function getBBox(lat, lon, zoom, width, height) {
	var tile_size = 256;
	var xytile = getTileNumber(lat, lon, zoom);
	var xtile = xytile[0];
	var ytile = xytile[1];

	var xtile_s = (xtile * tile_size - width  / 2) / tile_size;
	var ytile_s = (ytile * tile_size - height / 2) / tile_size;
	var xtile_e = (xtile * tile_size + width  / 2) / tile_size;
	var ytile_e = (ytile * tile_size + height / 2) / tile_size;

	var lonlat_s = getLonLat(xtile_s, ytile_s, zoom);
	var lonlat_e = getLonLat(xtile_e, ytile_e, zoom);

	return [lonlat_s[0], lonlat_s[1], lonlat_e[0], lonlat_e[1]];
}

module.exports = {

	re: /^https?:\/\/(?:www\.)?openstreetmap\.org\/\?.+/i,

	mixins: [
		'html-title',
		'favicon'
	],

	getLink: function(url) {
		var query = URL.parse(url, true).query;
		var links = [];

		if (query.lat && query.lon) {
			var embed_width  = 640;
			var embed_height = 480;

			var thumb_width  = 320;
			var thumb_height = 240;

			var lat = Number(query.lat);
			var lon = Number(query.lon);
			var zoom = isNaN(query.zoom) ? 10 : Math.floor(Number(query.zoom));
			if (zoom < 0)       zoom =  0;
			else if (zoom > 18) zoom = 18;

			var bbox  = getBBox(lat, lon, zoom, embed_width, embed_height);
			var layer = query.layers && LayerMap[query.layers.charAt(0)] || 'mapnik';

			// There is no encodeURIComponent or similar used on purpose, because
			// OpenStreetMap wants the ',' of the bbox parameter unencoded!
			links.push({
				href: "http://www.openstreetmap.org/export/embed.html?bbox="+
				      bbox.join(',')+'&layer='+layer,
				rel:  CONFIG.R.reader,
				type: CONFIG.T.text_html,
				width:  embed_width,
				height: embed_height
			});

			links.push({
				href: "http://staticmap.openstreetmap.de/staticmap.php?"+
					"center="+lat+","+lon+"&"+
					"zoom="+zoom+"&"+
					"size="+thumb_width+"x"+thumb_height+"&"+
					"maptype="+layer,
				rel:  CONFIG.R.thumbnail,
				type: CONFIG.T.image_png,
				width:  thumb_width,
				height: thumb_height
			});
		}

		return links;
	},

	tests: [
		"http://www.openstreetmap.org/?lat=48.12446&lon=16.42282&zoom=15&layers=M"
	]
};
