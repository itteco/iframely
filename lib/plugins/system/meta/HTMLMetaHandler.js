var decodeHTML5 = require('entities').decodeHTML5;
var _ = require('underscore');
var url = require('url');

var utils = require('../../../utils');

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

            var propertyParts = ('property' in metaTag) ? metaTag.property.split(':') : metaTag.name.split(':');

            var value = metaTag.content || metaTag.value;

            if (typeof(value) === 'string') {
                // Remove new lines.
                value = value.replace(/(\r\n|\n|\r)/gm,"");
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

        } else if (metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'content-type') {

            // Override encoding with <meta content='text/html; charset=UTF-8' http-equiv='Content-Type'/>
            this._charset = getCharset(metaTag.content);

        } else if (metaTag['charset']) {

            // Override encoding with <meta charset="UTF-8" />.
            this._charset = getCharset(metaTag.charset, true);

        } else if (metaTag['http-equiv'] && metaTag['http-equiv'].toLowerCase() == 'x-frame-options') {

            this._customProperties["x-frame-options"] = metaTag.content;

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
        this._customProperties[this._currentCustomTag.name] = this._currentCustomTag.value;
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
                if ((obj[k].length == 2) && (typeof(obj[k][0]) == 'object') && ((typeof(obj[k][1])!='undefined') && (typeof(obj[k][1])!='object'))){
                    obj[k][0][(k == 'audio' || k == 'image' || k == 'video') ? 'url' : 'value'] = obj[k][1];
                    obj[k] = obj[k][0];
                }
            } else if (typeof obj[k] == "object"){
                processArrays(obj[k]);
            }
        }
    }

    encodeAllStrings(this._result);
    processArrays(this._result);
    lowerCaseKeys(this._result);

    this._result['charset'] = this._charset || 'UTF-8';

    this._callback(null, this._result);
};

function merge(parentObj, props, value) {

    function _buildChildren(children, obj) {

        var current = obj;

        children.forEach(function(child) {

            var currentChild = current[child];

            if (typeof(currentChild) !== 'object') {

                if (typeof(currentChild) === 'undefined') {

                    current[child] = {};

                } else {

                    if (child === 'audio' || child === 'image' || child === 'video') {

                        current[child] = {
                            url: current[child]
                        };

                    } else {

                        current[child] = {
                            value: current[child]
                        };
                    }
                }
            }

            if (currentChild instanceof Array) {

                // Get last child.
                current = currentChild[currentChild.length - 1];

            } else {

                current = current[child];
            }
        });

        return current;
    }

    if (props.length === 0) {
        return;
    }

    var currentNode = props[props.length - 1];

    if (typeof(currentNode) === 'undefined'){
        return;
    }

    var parentNode = _buildChildren(props.slice(0, -1), parentObj);

    // Special case for media arrays.
    var currentNodeObject = parentNode[currentNode];
    if (typeof(currentNodeObject) === 'object' && (currentNode === 'audio' || currentNode === 'image' || currentNode === 'video')) {
        if (currentNodeObject instanceof Array) {
            currentNodeObject.push({});
        } else {
            currentNodeObject = [currentNodeObject, {}];
            parentNode[currentNode] = currentNodeObject;
        }

        parentNode = currentNodeObject[currentNodeObject.length - 1];
        currentNode = 'url';
    }

    if (!(currentNode in parentNode)) {

        // New node.

        parentNode[currentNode] = value;

    } else if (_.isArray(parentNode[currentNode])) {

        // Push to existing array.

        parentNode[currentNode].push(value);

    } else {

        // Create array.

        if (parentNode[currentNode] != value){
            parentNode[currentNode] = [parentNode[currentNode], value];
        }
    }
}

module.exports = HTMLMetaHandler;

module.exports.notPlugin = true;