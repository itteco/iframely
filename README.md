# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 gateway endpoint

Look at example debug tool urls to see how it works:

 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D_l96hPlqzcI
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fmashable.com%2F2013%2F06%2F05%2Fdominos-drone%2F
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.flickr.com%2Fphotos%2Fnf39%2F8941500522%2F

## Server setup

### Installation

Node.js 0.8-0.10 required. Install if from [pre-built installer](http://nodejs.org/download/) for your platform or from [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

### Config

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Setup values listed in config as you wish. You may override any values from config.js.

### Run server

    node server

Also you can use [forever](https://github.com/nodejitsu/forever):

    npm install -g forever
    forever start -l iframely.log server.js

### Server debug tool

You can test server API with debug tool at:

 - [http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)

### Run tests

    npm test

All functionality is not covered by tests for now. Tests depends on non stable web pages and sometimes crashes for no reason.

## Documentation

### Using as npm package

Install:

    npm install iframely

Usage:

    var iframely = require("iframely");

    // TODO: doc on iframely.getRawLinks
    // TODO: doc on iframely.getPageData
    // TODO: doc on iframely.getImageMetadata

---------------------------------------

### Using REST API

#### /oembed2

##### meta

##### links

#### /meta-mappings

#### /reader.js

#### /render

---------------------------------------

### JavaScript client lib iframely.js

Iframely can be used from client application using `/static/js/iframely.js` client script. It provides shortcuts to fetch data from `/oembed2` API endpoint and render links.

#### Deploy on your page

Insert following lines in your page head:

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/itteco/iframely/master/static/js/iframely.js"></script>

You should copy `iframely.js` script file to your static dir and change path properly.

To support proportional size iframes add following styles:

    <style>
        .oembed-container iframe {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .oembed-container {
            position: relative;
            left: 0px;
            width: 100%;
            height: 0px;
        }
    </style>

This will allow youtube, vimeo and similar players to be resized by container where they are placed and keep their proportion.

#### Fetching oEmbed

    // Setup endpoint path.
    $.iframely.defaults.endpoint = 'http://your.iframely.server.domain/oembed2';

    // Start data fetching. Specify page uri and result callback.
    $.iframely.getPageData("http://vimeo.com/67452063", function(error, data) {
        console.log(data);
    });

This code will create following [log](http://dev.iframe.ly/oembed2?uri=http%3A%2F%2Fvimeo.com%2F67452063):

    {
      "meta": {
        "canonical": "http://vimeo.com/67452063",
        "title": "BLACK&BLUE",
        "author": "ruud bakker",
        "author_url": "http://vimeo.com/ruudbakker",
        "duration": 262,
        "site": "Vimeo",
        "description": "Is it bad luck?\nIs it fate?\nOr just stupid?\n\nBLACK&BLUE is my graduation film from AKV st. Joost, Breda, The Netherlands.\n\nWritten, animated and directed by Ruud Bakker\nMusic and sounddesign by Bram Meindersma, Audiobrand\n\nScreenings\n\nPictoplasma Berlin, Germany 2013\nKlik! Amsterdam, The Netherlands 2012\nMultivision, st Petersburg, Russia 2012\nCut-Out Fest, Querétaro, Mexico 2012\nFête de l'anim, Lille, France 2012\nPlaygrounds Festival, Tilburg, The Netherlands, 2012\n\nwww.thisisbeker.com"
      },
      "links": [
        {
          "href": "//player.vimeo.com/video/67452063",
          "type": "text/html",
          "rel": [
            "player",
            "iframely"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "aspect-ratio": 1.778
          }
        },
        {
          "href": "http://a.vimeocdn.com/images_v6/apple-touch-icon-72.png",
          "type": "image",
          "rel": [
            "icon",
            "iframely"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "width": 72,
            "height": 72
          }
        },
        {
          "href": "http://b.vimeocdn.com/ts/439/417/439417999_1280.jpg",
          "type": "image",
          "rel": [
            "thumbnail",
            "oembed"
          ],
          "title": "BLACK&BLUE",
          "media": {
            "width": 1280,
            "height": 720
          }
        }
      ]
    }

This is parsed JSON object. You can use `data.meta` to get some page data or `data.links` to render some objects from the page.

#### Rendering links

Each link of result from previous example can be rendered:

    // Iterate through all links.
    data.links.forEach(function(link) {

        // Call generator to create html element for link.
        var $el = $.iframely.generateLinkElement(link);

        // Add element to body.
        $('body').append($el);
    });


If you want to make `reader` iframes without horizontal scrolling call:

    $.iframely.registerIframesIn($('body'));

This is useful with [github.gist](http://dev.iframe.ly/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[storify](http://dev.iframe.ly/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages,
where js widget is inserted in iframe and we don't know exact size before it launched.
After widget is rendered, custom script in that iframe sends message to parent about new window size.
So iframely.js will resize that iframe to fit content wihtout horizontal scrolling.

---------------------------------------

### Writing plugins

#### plugin.getLink(s)

#### plugin.getMeta

#### plugin.getData

#### plugin.tests

#### Generic plugins

##### Meta plugins

#### Domain plugins

#### Custom plugins

#### x-safe-html

#### Rendering templates.

#### Resize embedded iframe from inside iframe.

