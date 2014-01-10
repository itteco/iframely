GLOBAL.CONFIG = require('../../config');

var url = require("url");

var utils = require('./utils');

var getUrl = utils.getUrl;

var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget')
var oembed = require('./oembed');
var htmlMetaPlugin = require('./plugins/htmlMeta');
var selectorPlugin = require('./plugins/selector');
var readabilityPlugin = require('./plugins/readability');

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

        // Init htmlparser handler.
        var handler = new CollectingHandlerForMutliTarget();
        var parser = new Parser(handler, {
            lowerCaseTags: true
        });
        handler.response = resp;

        // Begin plugins work.

        // 1) Meta.
        var meta;
        htmlMetaPlugin.getData(uri, handler, function(error, result) {

            console.log('got META\t\t', new Date().getTime());

            // TODO: remove metaHandler from targets.
            console.log('html-title:', result['html-title']);

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

        // 2) jQuery simulation.
        selectorPlugin.getData(handler, function(error, $) {
            console.log("$('a').length: ", $('a').length);
            console.log('got Cheerio\t\t', new Date().getTime());
        });

        // 3) Readability.
        readabilityPlugin.getData(uri, handler, function(error, readability) {
            console.log('article title:', utils.encodeText(meta && meta.charset, readability.getTitle()));
            console.log('got article\t\t', new Date().getTime());
        });

        // Proxy data.
        resp.on('data', parser.write.bind(parser));
        resp.on('end', parser.end.bind(parser));
    });
};

//getUri('http://habrahabr.ru/post/208476/');
getUri('http://www.gazeta.ru/social/2014/01/09/5841297.shtml');
//getUri('http://www.youtube.com/watch?v=9nRHvVKRIv8');

