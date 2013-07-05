var URL = require("url");
var jQuery = require('jquery');
var QueryString = require("querystring");

var TypeMap = {
    m: 'roadmap',
    k: 'sattelite',
    p: 'terrain',
    k: 'hybrid'
};

module.exports = {

    re: /^https?:\/\/maps\.google\.(?:com?\.)?[a-z]+\/(?:maps(?:\/ms)?)?\?.+/i,

    mixins: [
        'html-title',
        'favicon'
    ],

    getLink: function(url) {
        var query = URL.parse(url,true).query;
        var iframe_query = jQuery.extend({},query,{ie: 'UTF8', output: 'embed'});
        delete iframe_query.z;

        if (!query.spn && query.sspn) {
            iframe_query.spn = query.sspn;
        }
        
        if (!query.ll && query.sll) {
            iframe_query.ll = query.sll;
        }

        if (!query.f && (query.saddr || query.daddr)) {
            iframe_query.f = 'd';
        }

        var links = [{
            href: 'https://maps.google.com/maps?'+QueryString.stringify(iframe_query),
            rel: CONFIG.R.reader,
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
            var config = CONFIG.providerOptions["google.maps"];
            if (config && config.apiKey) {
                thumb_query.apiKey = config.apiKey;
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
        "https://maps.google.com/maps?saddr=Linz,+Austria&daddr=48.8674527,2.3531961+to:London,+United+Kingdom&hl=en&sll=49.843352,7.08885&sspn=5.930447,16.907959&geocode=Ffwa4QIdBvzZAClNhZn6lZVzRzHEdXlXLClTfA%3BFXyo6QIdLOgjACmptoaSEG7mRzHRA-RB5kIhIA%3BFa7_EQMd8Cv-_yl13iGvC6DYRzGZKtXdWjqWUg&oq=London&t=h&mra=dpe&mrsp=1&sz=7&via=1&z=7",
        "https://maps.google.com/maps/ms?msid=200639360345265791507.0004e066058111401f6e7&msa=0&ll=50.522158,15.943909&spn=1.066929,4.22699",
        "https://maps.google.com.ua/maps?q=%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D1%81%D0%BA%D0%B0+%D0%B0%D0%B5%D1%81&hl=uk&ie=UTF8&ll=51.376442,30.132086&spn=0.01539,0.022144&sll=48.33599,31.18287&sspn=16.793485,22.675781&t=h&hq=%D1%87%D0%BE%D1%80%D0%BD%D0%BE%D0%B1%D0%B8%D0%BB%D1%8C%D1%81%D0%BA%D0%B0+%D0%B0%D0%B5%D1%81&z=16",
        "http://goo.gl/maps/WmfmA"
    ]
};
