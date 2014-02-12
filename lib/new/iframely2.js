GLOBAL.CONFIG = require('../../config');

var url = require("url");
var _ = require("underscore");

var utils = require('./utils');

var getUrl = utils.getUrl;

var oembedDataPlugin = require('./plugins/custom/oembed/oembedData');
var oembedLinksFromUriPlugin = require('./plugins/custom/oembed/oembedLinksFromUri');
var oembedLinksFromMetaPlugin = require('./plugins/custom/oembed/oembedLinksFromMeta');
var htmlMetaPlugin = require('./plugins/htmlMeta');
var cheerioPlugin = require('./plugins/custom/cheerio');
var readabilityPlugin = require('./plugins/generic/readability');
var htmlparserPlugin = require('./plugins/custom/htmlparser');

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

    htmlparserPlugin.getData(uri, function(error, result) {
        if (error) {
            return console.error(error);
        }

        var hrmlparser = result.hrmlparser;

        console.log('start response\t\t', new Date().getTime());

        // 1) Meta.
        var meta;
        htmlMetaPlugin.getData(uri, hrmlparser, function(error, result) {

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
        cheerioPlugin.getData(hrmlparser, function(error, result) {
            var $ = result.cheerio;
            console.log("$('a').length: ", $('a').length);
            console.log('got Cheerio\t\t', new Date().getTime());
        });

        // 3) Readability.
        readabilityPlugin.getData(uri, hrmlparser, function(error, result) {
            var readability = result.readability;
            console.log(meta && meta.charset);
            console.log('article title:', utils.encodeText(meta && meta.charset, readability.getTitle()));
            console.log('got article\t\t', new Date().getTime());
        });
    });
};

//getUri('http://habrahabr.ru/post/208476/');
getUri('http://www.gazeta.ru/social/2014/01/09/5841297.shtml');
//getUri('http://www.youtube.com/watch?v=9nRHvVKRIv8');

