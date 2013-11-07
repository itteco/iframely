var fs = require('fs');
var async = require('async');
var util = require('util');
var jquery = require('jquery');
var cheerio = require('cheerio');

console.log('start');

var file = fs.readFileSync('./test.html').toString();

var count = 0;

async.whilst(
    function () {
        return true;
    },
    function (callback) {

        count++;

        var $ = cheerio.load(file);

        // Usage.
        console.log($('p').length);

        // Log mem.
        console.log(util.inspect(process.memoryUsage()));

        callback();
    },
    function (err) {

    }
);

