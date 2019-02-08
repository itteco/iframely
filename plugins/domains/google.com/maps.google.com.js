var URL = require("url");
var _ = require('underscore');
var QueryString = require("querystring");

var TypeMap = {
    m: 'roadmap',
    k: 'sattelite',
    p: 'terrain',
    k: 'hybrid'
};

function diameterToZoom (diameter) {
    var zoom = Math.floor(19 - Math.log(diameter / 1000) / Math.LN2);
    return zoom < 0 ? 0 : zoom > 20 ? 20 : zoom;
}

module.exports = {

    re: [
        /^https?:\/\/maps\.google\.(?:com?\.)?[a-z]+\/(?:maps(?:\/ms|\/preview)?)?[\?\#].+/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps(?:\/preview)?[\?\#].+&.+/i
    ],

    mixins: [
        '*'
    ],

    getLink: function(url, options) {
        url = URL.parse(url,true);

        var query = url.query;

        // convert new url scheme to old
        if (query.output !== 'classic' && url.hash) {
            var hash = QueryString.parse(url.hash.replace(/^#?!/,''));

            if (hash.q) {
                query.q = hash.q;
            }

            if (hash.data) {
                var data = hash.data.split('!');
                var lat = 0;
                var lon = 0;
                var i;

                for (i = 0; i < data.length; ++ i) {
                    var arg = data[i];
                    if (/^1d\d+/.test(arg)) { // visible distance
                        query.z = diameterToZoom(Number(arg.slice(2)));
                    }
                    else if (/^2d./.test(arg)) { // longitude
                        lon = arg.slice(2);
                    }
                    else if (/^3d./.test(arg)) { // latitude
                        lat = arg.slice(2);
                    }
                    else if (arg === '1e0') { // maps
                        query.t = 'm';
                    }
                    else if (arg === '1e2') { // image gallery
                        query.lci = 'com.panoramio.all';
                    }
                    else if (arg === '1e3') { // satellite
                        query.t = 'h';
                    }
                }
                query.ll = lat+','+lon;
            }
        }

        delete query.output;

        var iframe_query = _.extend({},query,{ie: 'UTF8', output: 'embed'});

        if (!query.spn && query.sspn) {
            iframe_query.spn = query.sspn;
        }
        
        if (!query.ll && query.sll) {
            iframe_query.ll = query.sll;
        }

        if (!query.f && (query.saddr || query.daddr)) {
            iframe_query.f = 'd';
        }

        if (iframe_query.spn) {
            delete iframe_query.z;
        }

        var links = [{
            href: 'https://maps.google.com/maps?'+QueryString.stringify(iframe_query),
            rel: CONFIG.R.app,
            type: CONFIG.T.text_html,
            "min-width":  100,
            "min-height": 100
        }];

        var thumb_query = {
            format: 'png',
            size:   '250x250',
            sensor: 'false',
            center: query.ll||query.sll||query.near||query.saddr||query.daddr||query.q,
            zoom:   14
        };
        if (thumb_query.center) {
            var zoom = query.z || query.sz;
            if (Array.isArray(zoom)) {
                zoom = zoom[zoom.length-1];
            }
            if (zoom) {
                zoom = parseInt(zoom,10);
                if (!isNaN(zoom)) {
                    // zoom out a bit because we can assuem that
                    // the thumbnail is smaller than the map:
                    thumb_query.zoom = Math.max(zoom-1,0);
                }
            }
            var apiKey = options.getProviderOptions('google.maps.apiKey');
            if (apiKey) {
                thumb_query.apiKey = apiKey;
            }
            if (query.hl) {
                thumb_query.language = query.hl;
            }
            if (TypeMap.hasOwnProperty(query.t)) {
                thumb_query.maptype = TypeMap[query.t];
            }
            var markers = [], visible = [];
            if (query.saddr) { visible.push(query.saddr); markers.push('color:green|label:A|'+query.saddr); }
            if (query.daddr) { visible.push(query.daddr); markers.push('color:green|label:B|'+query.daddr); }
            if (markers.length > 0) {
                thumb_query.markers = markers;
                thumb_query.visible = visible.join('|');
                // let 'visible' determine the zoom:
                delete thumb_query.zoom;
            }
            links.push({
                href: 'http://maps.googleapis.com/maps/api/staticmap?'+QueryString.stringify(thumb_query),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_png,
                width:  250,
                height: 250
            });
        }

        return links;
    },

    tests: [
        // This plugin is now obsolete. HTMLParser re-directs old URLs to the new plugin.        
        /* 
        "https://maps.google.com/maps?saddr=Linz,+Austria&daddr=48.8674527,2.3531961+to:London,+United+Kingdom&hl=en&sll=49.843352,7.08885&sspn=5.930447,16.907959&geocode=Ffwa4QIdBvzZAClNhZn6lZVzRzHEdXlXLClTfA%3BFXyo6QIdLOgjACmptoaSEG7mRzHRA-RB5kIhIA%3BFa7_EQMd8Cv-_yl13iGvC6DYRzGZKtXdWjqWUg&oq=London&t=h&mra=dpe&mrsp=1&sz=7&via=1&z=7",
        "https://maps.google.com.ua/maps?q=%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D1%81%D0%BA%D0%B0+%D0%B0%D0%B5%D1%81&hl=uk&ie=UTF8&ll=51.376442,30.132086&spn=0.01539,0.022144&sll=48.33599,31.18287&sspn=16.793485,22.675781&t=h&hq=%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D1%81%D0%BA%D0%B0+%D0%B0%D0%B5%D1%81&z=16",
        "http://goo.gl/maps/WmfmA",
        "https://www.google.com/maps/preview#!q=hotel&data=!1m4!1m3!1d849587!2d29.1797946!3d47.0152013!2m1!1e3!4m10!1m9!4m8!1m3!1d849633!2d19.1797946!3d47.0152013!3m2!1i1920!2i937!4f13.1&fid=7"
        */
    ]
};
