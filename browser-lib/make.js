(function() {
var fs = require('fs');
var path = require('path');
var ender = require('ender');

var buildDir = path.join(__dirname, 'build');

if (!path.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, 0700);
}

var cd = process.cwd();
process.chdir(buildDir);
ender.build(['..'], {}, function() {
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
