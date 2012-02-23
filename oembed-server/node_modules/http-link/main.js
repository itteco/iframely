(function(httpLink) {

const HT = '\t';
const SP = ' ';
const CR = '\r';
const NF = '\n';

const SPACES = [SP, HT, CR, NF];

const SEPARATORS = [
    '(', ')', '<', '>', '@', 
    ',', ';', ':', '\\', '"',
    '/', '[', ']', '?', '=',
    '{', '}', SP, HT
];

function skipSpaces(value, pos) {
    while (pos < value.length && SPACES.indexOf(value.charAt(pos)) >= 0) pos++;

    return pos;
}

function readToken(value, pos) {
    var start = pos;
    while (pos < value.length && SEPARATORS.indexOf(value.charAt(pos)) == -1) {
        pos++;
    }
    
    return value.substring(start, pos);
}

function readQuotedString(value, pos) {
    var ch;
    var start = pos;
    
    pos++;
    while (pos < value.length) {
        ch = value.charAt(pos);
        if (ch === '"') break;
        if (ch === '\\') pos++;
        pos++;
    }
    
    return value.substring(start, pos + 1);
}

function decodeQuotedString(value) { 
    value = value.substr(1, value.length - 2);
    var start = 0, p;
    var result = '';
    
    while((p = value.indexOf('\\', start)) != -1) {
        result += value.substring(start, p);
        start = p + 2;
    }
    
    result += value.substring(start);
    
    return result;
}

function readLinkParam(value, pos, link) {
    var pname = readToken(value, pos);
    pos = skipSpaces(value, pos + pname.length);
    if (value.charAt(pos) !== '=')
        throw new Error('Unexpected token: ' + pos);

    pos++;
    var isQuotedString = value.charAt(pos) === '"';
    var pvalue = isQuotedString? readQuotedString(value, pos): readToken(value, pos);
    pos += pvalue.length;
    
    link[pname] = isQuotedString? decodeQuotedString(pvalue): pvalue;
    
    return pos;
}

function readLink(value, pos, link) {
    if (value.charAt(pos) !== '<')
        throw new Error('Unexpected token: ' + pos);
    
    var p = value.indexOf('>', pos);
    if (p === -1) throw new Error('Unexpected token: ' + pos);

    link.href = value.substring(pos + 1, p);
    pos = skipSpaces(value, p + 1);
    
    while(pos < value.length && value.charAt(pos) === ';') {
        pos = skipSpaces(value, pos + 1);
        pos = readLinkParam(value, pos, link);
        pos = skipSpaces(value, pos);
    }
    
    return pos;
}

httpLink.parse = function(value) {
    var pos = 0;
    
    var links = [];
    var link;
    
    while (pos < value.length && (pos === 0 || value.charAt(pos) === ',' && pos++)) {
        link = {};
        pos = skipSpaces(value, pos);
        pos = readLink(value, pos, link);
        links.push(link);
        pos = skipSpaces(value, pos);
    }
    
    return links;
};

})(exports || (htmlLink = {}));
