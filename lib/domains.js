import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';
import log from '../logging.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var domainsObject = {domains: {}};
var currentWhitelistFilename;
var WHITELIST_DIR = path.resolve(__dirname, '../whitelist');

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
