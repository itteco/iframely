import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';
import log from '../logging.js';
import { XRegExp } from 'xregexp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var domainsObject = {domains: {}};
var currentWhitelistFilename;
var WHITELIST_DIR = path.resolve(__dirname, '../whitelist');

var _patterns_cache = {};

/**
 Pattern is `*.domain.com/article/*`.
 Where "*" are symbols, digits, underscore or dash.
*/
function getPatternRegexp(pattern) {
    if (pattern in _patterns_cache) {
        return _patterns_cache[pattern];
    }

    var bits = pattern.split('*');
    bits = bits.map(bit => {
        return XRegExp.escape(bit);
    });

    return _patterns_cache[pattern] = new RegExp('^(?:https?:)?//' + bits.join('[a-z0-9_-]+'), 'i');
}

function patternMatch(url, pattern) {
    var re = getPatternRegexp(pattern);
    return re.test(url);
}

function applyDomains(data) {

    domainsObject = data;

    log('New domains list activated.', Object.keys(data.domains).length, 'domains');
}

function readDomains(filename) {

    var domainsJson;

    try {
        console.log('Loading new domains file:', filename);
        domainsJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch(ex) {
        console.log("Error parsing new domains list:", ex);
    }

    if (domainsJson) {

        applyDomains(domainsJson);

        currentWhitelistFilename = filename;
    }
}

const DOMAINS_FILE_RE = /^domains-.*\.json$/;

function findLastDomainsFile() {

    if (!fs.existsSync(WHITELIST_DIR)) {
        return null;
    }

    var files = fs.readdirSync(WHITELIST_DIR);

    files = files.filter(function(path) {
        return DOMAINS_FILE_RE.test(path);
    });

    files.sort();

    if (files.length) {
        return path.resolve(WHITELIST_DIR, files[files.length -1]);
    } else {
        return null;
    }
}

function loadLastDomains() {
    var filename = findLastDomainsFile();
    if (filename && filename != currentWhitelistFilename) {
        readDomains(filename);
    } else {
        console.log('No local new domains file detected...');
    }
}

var loadFileTimeout;

function startScanDomains() {

    var watcher = chokidar.watch(WHITELIST_DIR, {
        interval: 1000,
        binaryInterval: 1000,
        ignoreInitial: true
    });

    watcher.on('add', function(p) {
        p = path.resolve('.', p);
        // Check if newer file added.
        if (p.match(DOMAINS_FILE_RE)) {
            // Wait sometime to be sure write finished.
            clearTimeout(loadFileTimeout);
            loadFileTimeout = setTimeout(function() {
                loadLastDomains();
            }, 5000);
        }
    });

    watcher.on('change', function(p) {
        p = path.resolve('.', p);
        // Reload last whitelist.
        if (p == currentWhitelistFilename) {
            // Wait sometime to be sure write finished.
            clearTimeout(loadFileTimeout);
            loadFileTimeout = setTimeout(function() {
                readDomains(p);
            }, 5000);
        }
    });

    loadLastDomains();
}

startScanDomains();

function extractDomain(uri) {
    var m = uri.toLowerCase().match(/^(?:https?:\/\/)?([^/:?]+)/i); // beware of :port
    if (m) {
        return m[1];
    } else {
        return null;
    }
}

function domainRecord(url) {
    const domain = extractDomain(url);
    if (!domain) {
        return patterns;
    }

    // Direct domain match.
    let result = domainsObject.domains[domain];
    if (result) {
        return result;
    }

    const bits = domain.split('.');
    if (bits.length > 2) {
        // From `sub.subdomain.domain.com` get:
        // `subdomain.domain.com`
        // `domain.com`
        for(var i = 1; i < bits.length - 1; i++) {
            var d = bits.slice(i).join('.');
            result = domainsObject.domains[d];
            if (result) {
                return result;
            }
        }
    }
}

function findRecordsByUrl(url) {
    const record = domainRecord(url);;
    return record?.records?.filter(record => {
        if (Array.isArray(record.re)) {
            return record.re.some(pattern => patternMatch(url, pattern));
        } else {
            return patternMatch(url, record.re);
        }
    });
}

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target, source) {
    const result = target ? { ...target } : {};

    for (const key of Object.keys(source)) {
        const src_value = source[key];
        const target_value = result[key];

        if (isObject(src_value) && isObject(target_value)) {
            result[key] = deepMerge(target_value, src_value);
        } else if (isObject(src_value)) {
            result[key] = deepMerge(null, src_value);
        } else {
            // Also overrides array.
            result[key] = src_value;
        }
    }

    return result;
}

function getMergedRulesByUrl(url) {
    const records = findRecordsByUrl(url);
    if (records && records.length) {
        return records.reduceRight((merged, record) => deepMerge(merged, record.rules), {});
    }
}
