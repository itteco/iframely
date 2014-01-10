GLOBAL.CONFIG = require('../../config');

var url = require("url");

var utils = require('./utils');

var getUrl = utils.getUrl;

var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;
var DomHandler = htmlparser2.DomHandler;
var Readability = require('readabilitySAX').Readability;
var cheerio = require('cheerio');

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');
var HTMLMetaHandler = require('./HTMLMetaHandler');
var oembed = require('./oembed');

var getUri = function(uri, settings, cb){
    if(typeof settings === "function"){
        cb = settings;
        settings = {};
    } else if(typeof settings === "string"){
        settings = {type: settings};
    } else {
        settings = {};
    }

    var calledCB = false;
    function onErr(err){
        if(calledCB) return;
        calledCB = true;

        err = err.toString();
        console.error(err);
        /*
        cb({
            title:        "Error",
            text:        err,
            html:        "<b>" + err + "</b>",
            error: true
        });
        */
    }

    console.log('start request\t\t', new Date().getTime());

    // Oembed 1.
    var oembedLinks = oembed.findOembedLinks(uri);
    if (oembedLinks) {
        oembed.getOembed(oembedLinks[0].href, function(error, oembed) {
            console.log('got OEMBED1\t\t', new Date().getTime());
            console.log(error, oembed);
        });
    }

    getUrl(uri).on("error", onErr).on("response", function(resp){

        console.log('start response\t\t', new Date().getTime());

        if("content-type" in resp.headers && resp.headers["content-type"].substr(0, 5) !== "text/"){
            //TODO we're actually only interested in text/html, but text/plain shouldn't result in an error (as it will be forwarded)
            onErr("document isn't text");
            return;
        }

        // hm...
        //resp.setEncoding('binary');

        var parserOptions = {
            lowerCaseTags: true
        };

        settings.pageURL = resp.location;

        // 1) Readability.
        var readability = new Readability(settings);

        // 2) jQuery simulation.
        var domHandler = new DomHandler(function(error, dom) {
            //console.log('DOM', dom);
            console.log('got DOM\t\t\t', new Date().getTime());
            var $ = cheerio.load(domHandler);
            console.log($('a').length);
            console.log('got Cheerio\t\t', new Date().getTime());
        });

        var meta;

        // 3) Meta parsing.
        var metaHandler = new HTMLMetaHandler(uri, resp.headers["content-type"], function(err, result) {
            console.log('got META\t\t', new Date().getTime());

            // TODO: remove metaHandler from targets.
            console.log(result['html-title']);

            // Oembed 2.
            if (!oembedLinks) {
                oembedLinks = oembed.findOembedLinks(uri, result);
                if (oembedLinks) {
                    oembed.getOembed(oembedLinks[0].href, function(error, oembed) {
                        console.log('got OEMBED2\t\t', new Date().getTime());
                        console.log(oembed);
                    });
                }
            }

            meta = result;
        });

        var handler = new CollectingHandlerForMutliTarget([domHandler, readability, metaHandler]);
        var parser = new Parser(handler, parserOptions);

        resp.on('data', parser.write.bind(parser));
        resp.on('end', parser.end.bind(parser));

        // Not nice peace of code to work with readability.
        resp.on('end', function() {

            console.log('start article check\t', new Date().getTime());

            for (
                var skipLevel = 1;
                readability._getCandidateNode().info.textLength < 250 && skipLevel < 4;
                skipLevel++
                ) {
                readability.setSkipLevel(skipLevel);
                handler.restartFor(readability);
            }

            //console.log('article', readability.getArticle());
            console.log('article', utils.encodeText(meta && meta.charset, readability.getTitle()));
            console.log('got article\t\t', new Date().getTime());
        });
    });
};

//getUri('http://habrahabr.ru/post/208476/');
getUri('http://www.gazeta.ru/social/2014/01/09/5841297.shtml');
//getUri('http://www.youtube.com/watch?v=9nRHvVKRIv8');

