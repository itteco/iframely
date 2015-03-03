var URL = require("url");
var QueryString = require("querystring");

var LayerMap = {
    M: 'mapnik',
    O: 'mapnik', // osma render is no longer supported
    C: 'cyclemap',
    T: 'transportmap',
    Q: 'mapquest'
};

var ReverseLayerMap = {
    mapnik:       'M',
    cyclemap:     'C',
    transportmap: 'T',
    mapquest:     'Q'
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

    re: /^https?:\/\/(?:www\.)?openstreetmap\.org\/(?:\?.+|\#.*map=.+|export\/embed\.html\?)/i,

    mixins: [
        'html-title',
        'favicon'
    ],

    getLink: function(url) {
        // Currently the notes and data layers aren't used in embeds and static maps,
        // but who knows, maybe that'll change?
        var layers, layer, zoom, lat, lon, bbox, marker, notes = false, data = false;

        url = URL.parse(url, true);

        // parse query string
        var query = url.query;

        layer  = query.layer;
        layers = query.layers;
        zoom   = Number(query.zoom);

        // lat & lon
        if ('lat' in query) { lat = Number(query.lat); }
        if ('lon' in query) { lon = Number(query.lon); }

        // bounding box
        if ('minlat' in query && 'minlon' in query && 'maxlat' in query && 'maxlon' in query) {
            bbox = [Number(query.minlon), Number(query.minlat),
                    Number(query.maxlon), Number(query.maxlat)];
        }
        else if ('bbox' in query) {
            bbox = query.bbox.split(',',4).map(Number);
        }

        if (bbox && bbox.some(isNaN)) {
            bbox = undefined;
        }

        // marker
        if ('mlon' in query && 'mlat' in query) {
            marker = [Number(query.mlat), Number(query.mlon)];
        }

        // parse hash
        query = QueryString.parse((url.hash||'').replace(/^#/,''));

        if (query.map) {
            if ('layers' in query) {
                layers = query.layers;
            }

            // zoom, lat & lon
            var map = query.map.split('/');
            zoom = Number(map[0]);
            lat  = Number(map[1]);
            lon  = Number(map[2]);

            if (!isNaN(lat) && !isNaN(lon)) {
                // hash overwrites query
                bbox = undefined;
            }
        }

        // lat & lon from marker if not otherwise defined
        if (isNaN(lat) || isNaN(lon)) {
            if (bbox) {
                // XXX: this might fail when bbox spans over coordinate system boundaries
                lon = (bbox[0] + bbox[2]) * 0.5;
                lat = (bbox[1] + bbox[3]) * 0.5;
            }

            if (marker) {
                lat = marker[0];
                lon = marker[1];
            }
        }

        if (isNaN(lat) || isNaN(lon)) {
            return [];
        }

        var embed_width  = 640;
        var embed_height = 480;

        // musst be > 40x40 to work
        var thumb_width  = 320;
        var thumb_height = 240;

        // parse extra layers
        if (layers) {
            if (layers.indexOf('N') >= 0) {
                notes  = true;
                layers = layers.replace(/N/g,'');
            }

            if (layers.indexOf('D') >= 0) {
                data   = true;
                layers = layers.replace(/D/g,'');
            }
        }

        if (layer && ReverseLayerMap.hasOwnProperty(layer)) {
            // ok
        }
        else if (layers && LayerMap.hasOwnProperty(layers)) {
            layer = LayerMap[layers];
        }
        else {
            layer = 'mapnik';
        }

        zoom = isNaN(zoom) ? 10 : Math.floor(zoom);
        if (zoom < 0) {
            zoom =  0;
        } else if (zoom > 18) {
            zoom = 18;
        }

        if (!bbox) {
            bbox = getBBox(lat, lon, zoom, embed_width, embed_height);
        }

        // don't use QueryString.stringify here because OpenStreetMap can't
        // cope with "," encoded as "%2C"
        var embed_url = "//www.openstreetmap.org/export/embed.html?bbox="+
                         bbox.join(',')+'&layer='+layer;

        var thumb_query = {
            show:  '1',
            fmt:   'png',
            layer: 'mapnik', // the only layer that seems to work currently
            lon:   lon,
            lat:   lat,
            z:     Math.max(0,zoom-1), // zoom out a bit for thumbnail
            w:     thumb_width,
            h:     thumb_height,
            att:   'none'
        };

        if (marker) {
            embed_url += '&marker='+marker.join(',');
            thumb_query.mlat0 = marker[0];
            thumb_query.mlon0 = marker[1];
        }

        return [{
            href: embed_url,
            rel:  CONFIG.R.app,
            type: CONFIG.T.text_html,
            "aspect-ratio": embed_width / embed_height
        }, {
            href: "http://ojw.dev.openstreetmap.org/StaticMap/?"+QueryString.stringify(thumb_query),
            rel:  CONFIG.R.thumbnail,
            type: CONFIG.T.image_png,
            width:  thumb_width,
            height: thumb_height
        }];
    },

    tests: [
        "http://www.openstreetmap.org/?lat=48.12446&lon=16.42282&zoom=15&layers=M",
        "http://www.openstreetmap.org/?lat=51.5064&lon=-0.1281&zoom=14&layers=MC",
        "http://www.openstreetmap.org/#map=12/50.2598/28.6695",
        {
            noFeeds: true
        }
    ]
};
