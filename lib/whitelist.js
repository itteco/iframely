    import * as chokidar from 'chokidar';
    import * as fs from 'fs';
    import * as path from 'path';
    import * as crypto from 'crypto';
    import * as _ from 'underscore';
    import * as utils from './utils.js';
    import log from '../logging.js';
    import request from 'request';

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';

    import CONFIG from '../config.loader.js';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    var whitelistObject = {domains: {}};
    var whitelistLastModified;
    var currentWhitelistFilename;
    var WHITELIST_DIR = path.resolve(__dirname, '../whitelist');

    function hash(value) {
        return crypto.createHash('md5').update(value).digest("hex");
    }

    function isAllowed(path, option) {
        var bits = path.split('.');
        var tags = getTags.apply(this, bits);

        // Plugins expect `undefined` if whitelist record does not contain a path explicitely.
        var isAllowed = tags && tags.includes('allow');
        if (!isAllowed) { // undefined
            isAllowed = !tags || !tags.includes('deny') ? undefined : false;
        } else { // return true or false;
            isAllowed = !option || tags.includes(option);
        }

        return isAllowed;
    }

    function getTags(source, type) {
        var s = this[source];
        var result = [];
        if (s) {
            result = s[type];
        }

        if (typeof result == "string") {
            result = [result];
        }

        return result;
    }

    function getWhitelistLinks(rels) {

        var result = [];

        var sources = _.intersection(rels, CONFIG.KNOWN_SOURCES);

        if (sources.length == 0 && rels.indexOf("player") > -1) {

            // Skip single player rel.

        } else {
            sources.forEach(function(source) {
                CONFIG.REL[source].forEach(function(type) {

                    var iframelyType = CONFIG.REL_MAP[type] || type;

                    if (rels.indexOf(iframelyType) > -1) {
                        result.push({
                            source: source,
                            type: type
                        });
                    }
                });
            });
        }

        return result;
    }

    function getRecordHash() {

        if (this.isDefault) {
            return '';
        }

        var data = {};
        var that = this;
        CONFIG.KNOWN_SOURCES.forEach(function(source) {
            if (source in that) {
                data[source] = that[source];
            }
        });

        return hash(JSON.stringify(data));
    }

    export function findRawWhitelistRecordFor(uri) {

        if (!whitelistObject || !whitelistObject.domains) {
            return null;
        }

        var patterns = extractDomainPatterns(uri, true);

        var record, i = 0;
        while(!record && i < patterns.length) {
            record = whitelistObject.domains[patterns[i]];
            i++;
        }

        return record;
    };

    export function findWhitelistRecordFor(uri, options) {

        if (!whitelistObject) {
            return null;
        }

        var disableWildcard = options && options.disableWildcard;

        var patterns = extractDomainPatterns(uri, disableWildcard);

        var record, i = 0;
        while(!record && i < patterns.length) {
            record = whitelistObject.domains[patterns[i]];
            if (record) {
                record = _.extend({
                    domain: patterns[i],
                    isAllowed: function(path, option) {
                        // String path: "og.video"
                        return isAllowed.apply(this, [path, option]);
                    },
                    getQATags: function(rel) {
                        var links = getWhitelistLinks(rel);
                        var that = this;
                        var tags = links.map(function(link) {
                            return getTags.apply(that, [link.source, link.type]);
                        });
                        tags = _.unique(_.flatten(tags));
                        // Remove allow if denied.
                        var allowIdx = tags.indexOf("allow");
                        var denyIdx = tags.indexOf("deny");
                        if (allowIdx > -1 && denyIdx > -1) {
                            tags.splice(allowIdx, 1);
                        }
                        return tags;
                    },
                    getRecordHash: getRecordHash,
                    isDefault: patterns[i] === "*" // true for wildcard from config
                }, record);

                if (options && options.exclusiveRel) {
                    record.exclusiveRel = options.exclusiveRel;
                    for(var rel in CONFIG.REL) {
                        if (rel !== options.exclusiveRel) {
                            // Remove all rels except exclusiveRel.
                            delete record[rel];
                        }
                    }
                }
            }
            i++;
        }

        return record;
    };

    export function getWhitelistObject() {
        return whitelistObject;
    };

    function extractDomain(uri) {
        var m = uri.toLowerCase().match(/^(?:https?:\/\/)?([^/:?]+)/i); // beware of :port
        if (m) {
            return m[1];
        } else {
            return null;
        }
    }

    function extractDomainPatterns(uri, disableWildcard) {

        var patterns = [];

        var domain = extractDomain(uri);
        if (!domain) {
            return patterns;
        }

        // Only full domain exact match.
        patterns.push(domain);

        // 'www' workaround.
        var bits = domain.split('.');
        if (bits[0] != 'www') {
            patterns.push('www.' + domain);
        } else {
            // Remove www.
            bits.splice(0, 1);
            domain = bits.join('.');
            patterns.push(domain);
        }

        // Wildcard pattern matches parent and this domain.
        if (bits.length > 2) {
            for(var i = 0; i < bits.length - 1; i++) {
                var d = bits.slice(i).join('.');
                patterns.push('*.' + d);
            }
        } else {
            patterns.push('*.' + domain);
        }

        if (!disableWildcard) {
            // System-wide top-level wildcard, taken from config.
            patterns.push('*');
        }

        return patterns;
    }

    function applyParsedWhitelist(data) {

        if (whitelistObject && whitelistObject.domains) {
            delete whitelistObject.domains["*"];
        }

        //utils.disposeObject(whitelistObject);

        whitelistObject = data;

        addWildcard();

        log('Domains list activated.', Object.keys(data.domains).length, 'domains, including disabled ones');
    }

    function readWhitelist(filename) {

        var newWhitelist;

        try {
            console.log('Loading domains file:', filename);
            newWhitelist = JSON.parse(fs.readFileSync(filename, 'utf8'));
        } catch(ex) {
            console.log("Error parsing domains list:", ex);
        }

        if (newWhitelist) {

            applyParsedWhitelist(newWhitelist);

            currentWhitelistFilename = filename;
        }
    }

    function addWildcard() {
        if (whitelistObject.domains && CONFIG.WHITELIST_WILDCARD) {
            whitelistObject.domains["*"] = CONFIG.WHITELIST_WILDCARD;
        }
    }

    function findLastWhitelist() {

        if (!fs.existsSync(WHITELIST_DIR)) {
            return null;
        }

        var files = fs.readdirSync(WHITELIST_DIR);

        files = files.filter(function(path) {
            return /iframely-.*\.json$/.test(path);
        });

        files.sort();

        if (files.length) {
            return path.resolve(WHITELIST_DIR, files[files.length -1]);
        } else {
            return null;
        }
    }

    function loadLastWhitelist() {

        var filename = findLastWhitelist();

        if (filename && filename != currentWhitelistFilename) {
            readWhitelist(filename);
        } else {
            console.log('No local domains file detected...');
            addWildcard();
        }

    }

    function startScanWhitelist() {

        var watcher = chokidar.watch(WHITELIST_DIR, {
            interval: 1000,
            binaryInterval: 1000,
            ignoreInitial: true
        });

        watcher.on('add', function(p) {
            p = path.resolve('.', p);
            // Check if newer file added.
            if (p.match(/iframely-.*\.json/)) {
                // Wait sometime to be sure write finished.
                setTimeout(function() {
                    loadLastWhitelist();
                }, 5000);
            }
        });

        watcher.on('change', function(p) {
            p = path.resolve('.', p);
            // Reload last whitelist.
            if (p == currentWhitelistFilename) {
                // Wait sometime to be sure write finished.
                setTimeout(function() {
                    readWhitelist(p);
                }, 5000);
            }
        });

        loadLastWhitelist();
    }

    startScanWhitelist();
    loadWhitelistUrl();

    function loadWhitelistUrl() {

        if (!currentWhitelistFilename && CONFIG.WHITELIST_URL && CONFIG.WHITELIST_URL_RELOAD_PERIOD) {

            log("Loading domains list from " + CONFIG.WHITELIST_URL);

            var options = {
                uri: CONFIG.WHITELIST_URL,
                json: true,
                qs: {
                    domain: CONFIG.baseAppUrl && CONFIG.baseAppUrl.replace(/.+\/\//, ''),
                    v: CONFIG.VERSION
                },
                headers: {
                    // Prevent caching.
                    'Cache-Control': 'no-cache'
                },
                // TODO: remove in helix-fetch
                gzip: true
            };

            if (whitelistLastModified) {
                options.headers['If-Modified-Since'] = whitelistLastModified;
            }

            request(utils.prepareRequestOptions(options), function(error, r, newWhitelist) {

                if (error) {
                    console.error('Error loading domains list from ' + CONFIG.WHITELIST_URL + ' : ' + error);
                } else if (r.statusCode === 500) {
                    console.error('Error loading domains list from ' + CONFIG.WHITELIST_URL + ' : ' + newWhitelist);
                } else if (r.statusCode === 304) {
                    log('Whitelist respond: 304 (not modified)');
                } else if (!newWhitelist || typeof newWhitelist === 'string') {
                    console.error('Error loading domains list from ' + CONFIG.WHITELIST_URL + ' : incorrect data: ' + newWhitelist);
                } else {

                    whitelistLastModified = r.headers['last-modified'];

                    applyParsedWhitelist(newWhitelist);
                }

                setTimeout(loadWhitelistUrl, CONFIG.WHITELIST_URL_RELOAD_PERIOD);
            });
        }
    }