var decodeHTML5 = require('entities').decodeHTML5;
var _ = require('underscore');
var url = require('url');

var utils = require('../../../utils');

var ldParser = require('./ld-json');

var getCharset = utils.getCharset;
var encodeText = utils.encodeText;
var lowerCaseKeys = utils.lowerCaseKeys;

var LINK_REL_SKIP_VALUES = [
    'help',
    'license',
    'next',
    'prefetch',
    'prev',
    'search',
    'stylesheet'
];

var LINK_REL_ARRAY_VALUES = [
    'alternate'
];

function HTMLMetaHandler(uri, contentType, callback) {
    this._uri = uri;
    this._charset = getCharset(contentType);
    this._callback = callback;

    this._result = {};

    this._customProperties = {};
    this._currentCustomTag = null;

    this._end = false;
}

HTMLMetaHandler.prototype.onerror = function(err) {

    if (this._end) return;
    this._end = true;

    this._callback(err);
};

HTMLMetaHandler.prototype.onopentag = function(name, attributes) {

    if (this._end) return;

    name = name.toUpperCase();

    if (name === 'META') {

        var metaTag = attributes;

        if (('property' in metaTag) || ('name' in metaTag)) {

            var propertyParts = ('property' in metaTag) ? metaTag.property.split(/(?::|\.)/) : metaTag.name.split(/(?::|\.)/);

            var value = metaTag.content || metaTag.value || metaTag.src;

            if (typeof(value) === 'string') {
                // Remove new lines.
                value = value.replace(/(\r\n|\n|\r)/gm, ' ');
                // Trim.
                value = value.replace(/^\s+|\s+$/g, '');
            }

            if (/^\d+$/.test(value)) { // convert to integer
                value = parseInt(value, 10);
            } else if (/^\d+\.\d+$/.test(value)) {
                value = parseFloat(value);
            }

            if (typeof value !== 'undefined') {
                merge(this._result, propertyParts, value);
            }

        } else if (!this._charset && metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'content-type') {

            // Set encoding with <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/>
            this._charset = getCharset(metaTag.content);

        } else if (!this._charset && metaTag['charset']) {

            // Set encoding with <meta charset="UTF-8" />.
            this._charset = getCharset(metaTag.charset, true);

        } else if (metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'x-frame-options') {

            this._customProperties["x-frame-options"] = metaTag.content;

        } else if (!this._refresh && metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'refresh') {

            // ex.: http://tv.sme.sk/v/29770/kalinak-o-ficovi-cudujem-sa-ze-vedie-vladu.html
            var refresh = metaTag.content && metaTag.content.match(/url=(?:'|")?([^'"]+)(?:'|")?/i);

            if (refresh) { 
                this._refresh = refresh[1];
            }

        } else if (metaTag.name == "description") {

            this._customProperties["html-description"] = metaTag.content;
        }

    } else if (name == 'TITLE') {

        this._currentCustomTag = {
            name: "html-title",
            value: ""
        };

    } else if (name == 'LINK') {

        var metaTag = attributes;
        var name = metaTag.name;
        var rel = metaTag.rel || name;
        var title = metaTag.title;
        var sizes = metaTag.sizes;
        var type = metaTag.type;
        var media = metaTag.media;
        var href;

        if (typeof(metaTag.href) == 'string') {
            href = metaTag.href.replace(/(\r\n|\n|\r)/gm,"");
            href = url.resolve(this._uri, href);
        }

        if (LINK_REL_SKIP_VALUES.indexOf(rel) == -1) {
            var existingProperty = this._customProperties[rel];

            if (existingProperty && !(existingProperty instanceof Array)) {
                existingProperty = this._customProperties[rel] = [existingProperty];
            }

            if (!existingProperty && LINK_REL_ARRAY_VALUES.indexOf(rel) > -1) {
                existingProperty = this._customProperties[rel] = [];
            }

            var property;
            if (type || sizes || media || title) {
                property = {
                    href: href
                };
                if (type) {
                    property.type = type;
                }
                if (sizes) {
                    property.sizes = sizes;
                }
                if (media) {
                    property.media = media;
                }
                if (title) {
                    property.title = title;
                }
            } else {
                property = href;
            }

            if (existingProperty) {
                existingProperty.push(property);
            } else {
                this._customProperties[rel] = property;
            }
        }
    } else if (name == 'SCRIPT') {
        
        if (attributes.type === 'application/ld+json') {

            this._currentCustomTag = {
                name: "ld-json",
                value: ""
            }
        }  
    } else if (name === 'HTML') {

        if (attributes.dir) {this._customProperties['dir'] = attributes.dir;}
        if (attributes.lang) {this._customProperties['lang'] = attributes.lang;}

    }
};

HTMLMetaHandler.prototype.ontext = function(text) {
    if (this._currentCustomTag) {
        this._currentCustomTag.value += text;
    }
};

HTMLMetaHandler.prototype.onclosetag = function(name) {

    if (this._end) return;

    if (this._currentCustomTag) {

        var existingCustomProperty = this._customProperties[this._currentCustomTag.name];

        var value = this._currentCustomTag.value;

        if (existingCustomProperty) {

            if (existingCustomProperty instanceof Array) {
                // Add value to existing array.
                existingCustomProperty.push(value);
            } else {
                // Create array if mutliple values.
                this._customProperties[this._currentCustomTag.name] = [existingCustomProperty, value];
            }

        } else {

            // New property.
            this._customProperties[this._currentCustomTag.name] = value;
        }

        this._currentCustomTag = null;
    }

    if (name.toUpperCase() === 'HEAD') {
        this._finalMerge();
    }
};

HTMLMetaHandler.prototype.onend = function() {
    if (this._end) return;
    this._finalMerge();
};

HTMLMetaHandler.prototype._finalMerge = function() {

    this._end = true;

    var that = this;

    for(var name in this._customProperties) {
        if (!(name in this._result)) {
            this._result[name] = this._customProperties[name];
        }
    }

    function encodeAllStrings(obj) {
        for (var k in obj) {
            if (typeof obj[k] == "object") {
                encodeAllStrings(obj[k]);
            } else {
                if (!obj.hasOwnProperty(k)) {
                    continue;       // skip this property
                }
                if (typeof(obj[k]) == 'string'){
                    // decode HTML entities after decoding the charset
                    // otherwise we would end up with a string with mixed encoding
                    obj[k] = decodeHTML5(encodeText(that._charset, obj[k]));
                }
            }
        }
    }

    //This is the "to-the-forehead" solution for those glitchy situations.
    function processArrays(obj){
        for (var k in obj) {

            if (!obj.hasOwnProperty(k)) {
                continue;

            } else if (obj[k] instanceof Array){

                // TODO: what is that???

                if ((obj[k].length === 2)
                    && (typeof(obj[k][0]) === 'object')
                    && ((typeof(obj[k][1]) !== 'undefined')
                        && (typeof(obj[k][1]) !== 'object'))){

                    obj[k][0][getDefaultKey(k)] = obj[k][1];

                    obj[k] = obj[k][0];
                }

            } else if (typeof obj[k] === "object"){
                processArrays(obj[k]);
            }
        }
    }

    /*
     ProcessSingleObjects works like:

     "og": {
         "image": [
             {
                "url": "https://thumbs.gfycat.com/PoliticalCalmGiantschnauzer-thumb100.jpg"
             },
             {
                "url": "https://thumbs.gfycat.com/PoliticalCalmGiantschnauzer-poster.jpg"
             }
         ]
     }

     to

     "og": {
         "image": [
            "https://thumbs.gfycat.com/PoliticalCalmGiantschnauzer-thumb100.jpg",
            "https://thumbs.gfycat.com/PoliticalCalmGiantschnauzer-poster.jpg"
         ]
     }
    */
    function getSingleValue(parentName, obj) {
        var key = getDefaultKey(parentName);
        if (key in obj) {
            if (_.keys(obj).length === 1) {
                return obj[key];
            }
        }
    }
    function processSingleObjects(obj) {

        for (var k in obj) {

            if (!obj.hasOwnProperty(k)) {
                continue;
            }

            var item = obj[k];

            if (item instanceof Array){

                for(var i = 0; i < item.length; i++) {
                    if (typeof item[i] === "object") {
                        var v = getSingleValue(k, item[i]);
                        if (v) {
                            item[i] = v;
                        }
                    }
                }

            } else if (typeof item === "object") {

                var v = getSingleValue(k, item);
                if (v) {

                    obj[k] = v;

                } else {
                    processSingleObjects(item);
                }
            }
        }
    }

    processArrays(this._result);
    processSingleObjects(this._result);

    encodeAllStrings(this._result);

    // Parse JSON after encodeAllStrings.
    ldParser(this._result);

    lowerCaseKeys(this._result);

    this._result['charset'] = this._charset || 'UTF-8';

    if (this._refresh) {this._result['refresh'] = this._refresh;}

    this._callback(null, this._result);
};

// TODO: add 'player': 1. Need some update in plugins.
var defaultMediaKeys = {'audio': 1, 'image': 1, 'video': 1, 'stream': 1};

function getDefaultKey(parent) {
    if (defaultMediaKeys[parent] && parent !== 'stream') {
        return 'url';
    } else {
        return 'value';
    }
}

function merge(parentObj, props, value) {

    /*
    Test urls:
     http://www.travelchannel.com/video/its-a-real-life-video-game
     http://cds.cern.ch/record/1628561
     http://www.dramafever.com/drama/4274/1/Heirs/?ap=1
     http://gfycat.com/PoliticalCalmGiantschnauzer
    */

    function _buildChildren(children, obj) {

        var current = obj;

        children.forEach(function(child) {

            var currentChild = current[child];

            if (currentChild instanceof Array) {

                // Get last child.
                var currentArray = currentChild;
                currentChild = currentChild[currentChild.length - 1];

                if (typeof(currentChild) !== 'object') {

                    var o = {};
                    o[getDefaultKey(child)] = currentChild;
                    currentChild = o;

                    currentArray[currentArray.length - 1] = currentChild;
                }

                current = currentChild;

            } else {

                if (typeof(currentChild) !== 'object') {

                    if (typeof(currentChild) === 'undefined') {

                        current[child] = {};

                    } else {

                        var o = {};
                        o[getDefaultKey(child)] = currentChild;
                        current[child] = o;
                    }
                }

                current = current[child];
            }
        });

        return current;
    }

    if (props.length === 0) {
        return;
    }

    var currentNodeName = props[props.length - 1];

    // Add 'url' to 'og:video'. And other same cases.
    if (props.length > 0 && defaultMediaKeys[currentNodeName]) {
        currentNodeName = getDefaultKey(currentNodeName);
        props = props.concat(currentNodeName);
    }

    // Create new node if property exist in last array object.
    /*

    Example:
        Have:
            [{
                url: 'xxx',
                type: 'yyy'
            }]
        Add:
            og.video.type = 'zzz'
        Result:
            [{
                url: 'xxx',
                type: 'yyy'
            }, {
                type: 'zzz'
            }]

    */
    if (props.length > 1) {
        var parentNodeName = props[props.length - 2];
        if (defaultMediaKeys[parentNodeName]) {
            // This will get last array item.
            var parentNode2 = _buildChildren(props.slice(0, -1), parentObj);
            // Check if property already exists. (e.g. og:video:type).
            /**/
            if (currentNodeName in parentNode2) {
                props = props.slice(0, -1);
                var _value = value;
                value = {};
                value[currentNodeName] = _value;
                currentNodeName = parentNodeName;
            }
        }
    }

    if (typeof(currentNodeName) === 'undefined'){
        return;
    }

    var parentNode = _buildChildren(props.slice(0, -1), parentObj);

    if (!(currentNodeName in parentNode)) {

        // New node.
        parentNode[currentNodeName] = value;

    } else if (_.isArray(parentNode[currentNodeName])) {

        var append = false;

        if (defaultMediaKeys[currentNodeName]) {
            var key = getDefaultKey(currentNodeName);
            var list = parentNode[currentNodeName];
            var currentChild = list[list.length - 1];
            if (typeof(currentChild) === 'object' && !currentChild[key]) {
                // Same as below in "***".
                currentChild[key] = value;
                append = true;
            }
        }

        if (!append) {
            // Push to existing array.
            parentNode[currentNodeName].push(value);
        }

    } else {

        var currentChild = parentNode[currentNodeName];
        var key = getDefaultKey(currentNodeName);

        if (typeof(currentChild) === 'object' && !currentChild[key]) {

            /*

            "***" Case description:
            Adding new url or value, but some child properties defined:

            have:   og.video = {width: 100);

            adding: og.video.url = "http://some.url";

            Result should be:

            og.video = {
                width: 100,
                url: "http://some.url"
            };

            If add again og.video = "http://some2.url"; then result should be:

            og.video = [{
                width: 100,
                url: "http://some.url"
            }, {
                url: "http://some2.url"
            }];

            */

            // Append to created object if value not present yet.
            currentChild[key] = value;

        } else {

            // Create array.
            if (parentNode[currentNodeName] != value){
                parentNode[currentNodeName] = [parentNode[currentNodeName], value];
            }
        }
    }
}

module.exports = HTMLMetaHandler;

module.exports.notPlugin = true;
