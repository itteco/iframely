GLOBAL.CONFIG = require('../../config');

var url = require("url");
var _ = require("underscore");

var utils = require('./utils');

var getUrl = utils.getUrl;

var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;

var CollectingHandlerForMutliTarget = require('./handlers/CollectingHandlerForMutliTarget')
var oembedDataPlugin = require('./plugins/oembed/oembedData');
var oembedLinksFromUriPlugin = require('./plugins/oembed/oembedLinksFromUri');
var oembedLinksFromMetaPlugin = require('./plugins/oembed/oembedLinksFromMeta');
var htmlMetaPlugin = require('./plugins/htmlMeta');
var cheerioPlugin = require('./plugins/cheerio');
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

    function handleError(error) {
        if (error) {
            console.error('error', error);
            return true;
        }
    }

    var context = {};
    var usedPlugins = {};

    // Oembed links 1.
    var c = oembedLinksFromUriPlugin.getData(uri);
    _.extend(context, c);

    // Oembed data 1.
    if (context.oembedLinks) {
        usedPlugins['oembedDataPlugin'] = true;
        oembedDataPlugin.getData(context.oembedLinks, function(error, c) {
            if (handleError(error)) return;

            _.extend(context, c);

            // - log
            console.log('got OEMBED1\t\t', new Date().getTime());
            console.log(error, c.oembed);
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

            meta = result.meta;

            console.log('got META\t\t', new Date().getTime());

            // TODO: remove metaHandler from targets.
            console.log('html-title:', meta['html-title']);

            // Oembed 2.
            if (!usedPlugins['oembedDataPlugin']) {
                // Oembed links 1.
                var c = oembedLinksFromMetaPlugin.getData(meta);
                _.extend(context, c);

                // Oembed data 1.
                if (context.oembedLinks) {
                    oembedDataPlugin.getData(context.oembedLinks, function(error, c) {

                        if (handleError(error)) return;

                        _.extend(context, c);

                        // - log
                        console.log('got OEMBED2\t\t', new Date().getTime());
                        console.log(error, c.oembed);
                    });
                }
            }
        });

        // 2) jQuery simulation.
        cheerioPlugin.getData(handler, function(error, result) {
            var $ = result.cheerio;
            console.log("$('a').length: ", $('a').length);
            console.log('got Cheerio\t\t', new Date().getTime());
        });

        // 3) Readability.
        readabilityPlugin.getData(uri, handler, function(error, result) {
            var readability = result.readability;
            console.log(meta && meta.charset);
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

