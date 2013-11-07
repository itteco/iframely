var jsdom = require('jsdom');
var fs = require('fs');
var async = require('async');
var util = require('util');
var jquery = require('jquery');

console.log('start');

var file = fs.readFileSync('./test.html').toString();
var jquery = fs.readFileSync("../lib/jquery.js").toString();

var count = 0;

async.whilst(
    function () {
        return true;
    },
    function (callback) {

        count++;

        jsdom.env({
            html: file,
            src: [jquery],
            done: function(error, window) {
                // Log mem.
                console.log(count, util.inspect(process.memoryUsage()));

                // Usage.
                var $ = window.$;
                console.log($('h3').length);

                // Free mem.
                window.close();

                callback();
            }
        });


    },
    function (err) {
    }
);

