# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 gateway endpoint

Look at example debug tool urls to see how it works:

 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D_l96hPlqzcI
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fmashable.com%2F2013%2F06%2F05%2Fdominos-drone%2F
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.flickr.com%2Fphotos%2Fnf39%2F8941500522%2F

## Table of contents

- [Server setup](#server-setup)
    - [Installation](#installation)
    - [Config](#config)
    - [Run server](#run-server)
    - [Server debug tool](#server-debug-tool)
    - [Run tests](#run-tests)
- [Reference](#reference)
    - [Using as npm package](#using-as-npm-package)
    - [Using REST API](#using-rest-api)
        - [/oembed2](#oembed2)
            - [meta](#meta)
            - [links](#links)
        - [/meta-mappings](#meta-mappings)
        - [/reader.js](#readerjs)
        - [/render](#render)
    - [JavaScript client lib iframely.js](#javascript-client-lib-iframelyjs)
        - [Deploy on your page](#deploy-on-your-page)
        - [Fetching oEmbed/2](#fetching-oembed2)
        - [Rendering links](#rendering-links)
    - [Writing plugins](#writing-plugins)
        - [Plugin structure](#plugin-structure)
            - [plugin.getLink(s)](#plugingetlinks)
            - [plugin.getMeta](#plugingetmeta)
            - [plugin.getData](#plugingetdata)
            - [plugin.mixins](#pluginmixins)
            - [plugin.tests](#plugintests)
        - [Type of plugins](#type-of-plugins)
            - [Generic plugins](#generic-plugins)
                - [Meta plugins](#meta-plugins)
            - [Domain plugins](#domain-plugins)
            - [Custom plugins](#custom-plugins)
            - [Template plugins](#template-plugins)
        - [Custom links cases](#custom-links-cases)
            - [x-safe-html](#x-safe-html)
            - [Rendering templates](#rendering-templates)
            - [Resize embedded iframe from inside iframe](#resize-embedded-iframe-from-inside-iframe)

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

## Reference

### Using as npm package

Install:

    npm install iframely

Usage:

    var iframely = require("iframely");

`TODO: doc on iframely.getRawLinks`
`TODO: doc on iframely.getPageData`
`TODO: doc on iframely.getImageMetadata`


---------------------------------------


### Using REST API

#### /oembed2

##### meta

Most pages supports meta data using different semantics: twitter, og, meta, dublin core, parsely, sailthru and so on.

Iframely provides unified way to access those attributes in one place and one way.

`meta` object provides useful available meta attributes of retrieved page in unified form. It could be:
 - title
 - description
 - author
 - date (publication date) `TODO: unify date type`
 - duration (in seconds, duration of video or audio content)
 - ... and more.

All attributes has unified names and listed in [/meta-mappings](#meta-mappings) endpoint.

Meta attributes provided by plugins [getMeta](#plugingetmeta) method.

##### links

#### /meta-mappings

Provides unified meta attributes mapping.

You can find current unified meta attributes mapping on [http://dev.iframe.ly/meta-mappings](http://dev.iframe.ly/meta-mappings).

Here is description of data:

    {
      "attributes": [                           -- List of all supported attributes in alphabetic order.
        "author",
        "author_url",
        ...
      ],
      "sources": {                              -- Object with each attribute source.
        "author": [
          {
            "pluginId": "twitter-author",       -- Plugin in which meta attribute is defined.
            "source": "meta.twitter.creator"    -- Part of that plugin code which returns meta attribute value.
          },
          ...
        ],
        ...
      }
    }

Meta attributes provided by plugins [getMeta](plugingetmeta) method.

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

#### Fetching oEmbed/2

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

This is parsed JSON object. You can use `data.meta` to get page meta attributes or `data.links` to render some objects from the page.

#### Rendering links

Each link in result from previous example can be rendered:

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
So iframely.js will resize that iframe to fit content without horizontal scrolling.


---------------------------------------


### Writing plugins

#### Plugin structure

##### plugin.getLink(s)

##### plugin.getMeta

`getMeta` function allow plugin to provide some page meta attributes.

Look at all meta plugins at: [/plugins/generic/meta](https://github.com/itteco/iframely/tree/master/plugins/generic/meta).

Names of attributes should be unified. Do not created different forms of one attribute name, line `author_url` and `author-url`.
See available attributes names to check if similar name exists at [/meta-mappings](#meta-mappings).

**Warging!** As meta-mappings generated using regexp modules parsing, all attributes should be described in specific form:
 - each attribute should be declared in separate line;
 - no other functions with `return` are not expected inside `getMeta` function.

See example [/generic/meta/video.js](https://github.com/itteco/iframely/blob/master/plugins/generic/meta/video.js):

    module.exports = {
        getMeta: function(meta) {

            // This prevents non useful errors loging with "undefined".
            if (!meta.video)
                return;

            return {
                duration: meta.video.duration,  // This will extract video duration.
                date: meta.video.release_date,  // If value is undefined - it will be removed from meta.
                author: meta.video.writer,
                keywords: meta.video.tag
            };
        }
    };

##### plugin.getData

##### plugin.mixins

##### plugin.tests



#### Type of plugins

##### Generic plugins

###### Meta plugins

##### Domain plugins

##### Custom plugins

##### Template plugins



#### Custom links cases

##### x-safe-html

##### Rendering templates.

##### Resize embedded iframe from inside iframe.

