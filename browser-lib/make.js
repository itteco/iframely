(function() {
var fs = require('fs');
var path = require('path');
var ender = require('ender');

var buildDir = path.join(__dirname, 'build');
var buildModulesDir = path.join(buildDir, 'node_modules');

if (!path.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, 0700);
    fs.mkdirSync(buildModulesDir, 0700);
    fs.symlinkSync('../../', path.join(buildModulesDir, 'iframely-oembed'));
}

fs.writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify({
    name: 'iframely-build',
    version: '1.0.0',
    
    dependencies: {
        'iframely-oembed': '*'
    }
}));

var cd = process.cwd();
process.chdir(buildDir);
ender.build(['.'], {}, function() {
    process.chdir(cd);
    fs.writeFileSync(path.join(__dirname, 'ender.js'), fs.readFileSync(path.join(buildDir, 'ender.js')));
    fs.writeFileSync(path.join(__dirname, 'ender.min.js'), fs.readFileSync(path.join(buildDir, 'ender.min.js')));
    rmdirSync(buildDir);
});

function rmdirSync(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var name = path.join(dir, file);
        var stat = fs.lstatSync(name);
        if (stat.isDirectory()) rmdirSync(name);
        else fs.unlinkSync(name);
    });
    fs.rmdirSync(dir);
}


})();
