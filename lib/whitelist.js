(function(whitelist) {

    var chokidar = require('chokidar'),
        fs = require('fs'),
        path = require('path');

    var whitelist;
    var currentWhitelistFilename;
    var WHITELIST_DIR = './whitelist';

    function readWhitelist(filename) {

        try {
            console.log('Loading whitelist:', filename);
            whitelist = JSON.parse(fs.readFileSync(filename, 'utf8'));
            currentWhitelistFilename = filename;
        } catch(ex) {
            console.log("Error loading whitelist:", ex);
        }
    }

    function findLastWhitelist() {

        var files = fs.readdirSync(WHITELIST_DIR);

        files = files.filter(function(path) {
            return /iframely-.*\.json/.test(path);
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
                loadLastWhitelist();
            }
        });

        watcher.on('change', function(p) {
            p = path.resolve('.', p);
            // Reload last whitelist.
            if (p == currentWhitelistFilename) {
                readWhitelist(p);
            }
        });

        loadLastWhitelist();
    }

    startScanWhitelist();

})();
