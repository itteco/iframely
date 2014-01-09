var WritableStream = require("readabilitySAX").WritableStream,
    minreq = require("minreq"),
    url = require("url");

var htmlparser2 = require("htmlparser2");
var Parser = htmlparser2.Parser;
var DomHandler = htmlparser2.DomHandler;
var Readability = require('readabilitySAX').Readability;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');

var getUri = function(uri, settings, cb){
    if(typeof settings === "function"){
        cb = settings;
        settings = {};
    } else if(typeof settings === "string"){
        settings = {type: settings};
    }

    var calledCB = false;
    function onErr(err){
        if(calledCB) return;
        calledCB = true;

        err = err.toString();
        cb({
            title:        "Error",
            text:        err,
            html:        "<b>" + err + "</b>",
            error: true
        });
    }

    console.log('start request\t\t', new Date().getTime());

    var req = minreq({
        uri: uri,
        only2xx: true,
        headers: {
            "user-agent": "Mozilla/5.0 (compatible; readabilitySAX/1.5;)"
        }
    }).on("error", onErr).on("response", function(resp){

            console.log('start response\t\t', new Date().getTime());

            if("content-type" in resp.headers && resp.headers["content-type"].substr(0, 5) !== "text/"){
                //TODO we're actually only interested in text/html, but text/plain shouldn't result in an error (as it will be forwarded)
                onErr("document isn't text");
                return;
            }

            var parserOptions = {
                lowerCaseTags: true
            };

            settings.pageURL = req.response.location;

            var readability = new Readability(settings);
            var domHandler = new DomHandler(function(error, dom) {
                //console.log('DOM', dom);
                console.log('got DOM\t\t\t', new Date().getTime());
            });

            var handler = new CollectingHandlerForMutliTarget([readability, domHandler]);
            var parser = new Parser(handler, parserOptions);

            req.on('data', parser.write.bind(parser));
            req.on('end', parser.end.bind(parser));

            req.on('end', function() {

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
                console.log('got article\t\t', new Date().getTime());
            });
        });
};

getUri('http://habrahabr.ru/post/208476/', function(article) {
    console.log(article);
});