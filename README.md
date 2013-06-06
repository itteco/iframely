# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 self-hosted embeds server. 
Iframely package saves you months of dev time on rich content parsers. So you can focus on enriching your users’ experience instead.

Main endpoint (see [example](http://dev.iframe.ly/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):
    /iframely?uri={url encoded http link to a web page}


Iframely provides out-of-the-box:
 - Generic parsers of [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and Readability articles
 - API for unified/merged meta, thumbnails (incl sizes), video, players, articles
 - Plugins arthitecture to extend the logic or to implement custom domain parsers
 - 100+ parsers for specific domains (well, it'll be so very soon)


Iframely is based on [oEmbed/2](#oembed2):
 - Name it "oEmbed two" or "half oEmbed"
 - It removes the semantics part of the spec
 - Leaves the discovery part through `<link>` tag
 - And specifies technological approaches and use case for embeds to improve end user's experience in modern realities

(c) 2013 Itteco Software Corp.
License is TBD. We envision free for non-commercial use, and a fee for commercial use.

## Jump To

- [oEmbed/2 quick draft](#oembed2)
- [Server setup](#server-setup)
    - [Installation](#installation)
    - [Config](#config)
    - [Run server](#run-server)
    - [List of server urls](#list-of-server-urls)
    - [Server debug tool](#server-debug-tool)
    - [Run tests](#run-tests)
- [Reference](#reference)
    - TODO [Using as npm package](#using-as-npm-package)
    - [Using REST API](#using-rest-api)
        - [/iframely](#iframely)
            - [meta](#meta)
            - [links](#links)
                - [MIME types](#mime-types)
                - [rel](#rel)
                - [media](#media)
        - [/meta-mappings](#meta-mappings)
        - [/reader.js](#readerjs)
        - [/render](#render)
    - [JavaScript client lib iframely.js](#javascript-client-lib-iframelyjs)
        - [Deploy on your page](#deploy-on-your-page)
        - [Fetching oEmbed/2](#fetching-oembed2)
        - [Rendering links](#rendering-links)
    - [Writing plugins](#writing-plugins)
        - TODO [Plugin structure](#plugin-structure)
            - TODO [plugin.getLink(s)](#plugingetlinks)
            - [plugin.getMeta](#plugingetmeta)
                - [plugin.getMeta priorities](#plugingetmeta-priorities)
            - TODO [plugin.getData](#plugingetdata)
            - TODO [plugin.mixins](#pluginmixins)
            - TODO [plugin.tests](#plugintests)
        - TODO [Type of plugins](#type-of-plugins)
            - TODO [Generic plugins](#generic-plugins)
                - TODO [Meta plugins](#meta-plugins)
            - TODO [Domain plugins](#domain-plugins)
            - TODO [Custom plugins](#custom-plugins)
            - TODO [Template plugins](#template-plugins)
        - TODO [Custom links cases](#custom-links-cases)
            - TODO [x-safe-html](#x-safe-html)
            - TODO [Rendering templates](#rendering-templates)
            - TODO [Resize embedded iframe from inside iframe](#resize-embedded-iframe-from-inside-iframe)

## oEmbed/2 quick draft

oEmbed/2 eliminates the semantic part of [oEmbed](http://oembed.com) as other semantic protocols such as [Open Graph]((http://ogp.me/)) and RDFa in general have clearly gone mainstream. Besides, there is plenty of other `<meta>` data, available for a web page. 

Thus, oEmbed/2 is primarily for discovery of what publisher has got to offer:
    <link rel="oembed"            // use case
    type="text/html"              // iframe
    href="//iframe.ly/234rds"     // src
    media="min-width: 100"        // sizes
    title="Thanks for all the fish!" >

Each embed representation should have it's own `<link>` in the head of HTML document. 

The use cases shall be listed in `rel` attributed, separated by a space. The dictionary of use cases is not fixed, and it is up to publisher and provider to choose what to publish or consume. 
Iframely endpoint currently can output the following `rel` use cases: `favicon`, `thumnail`, `image`, `player`, `reader`, `logo`.

`type` attribute of a link specified the MIME type of the link, and so dicttes the way the embed resources shall be embedded. Iframely supports embeds as iframe, image and javascript.

`href` attributes is preferrably via https protocol to ensure maximum distribution for publishers' content, as consumers may opt not to consder http-only embeds.

`media` is for media queries, indicating the sizes of the containers where embed content would fit. 


As a "good citizen" policy and business etiquette, it is worth to remind that both consumer and publisher work together towards a common goal of providing the best user experience possible for their shared audience, and not against each other in order to solicit a customer. Never should it be acceptable to undermine user experience in lieu of providing value.

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

### List of server urls

    /r3/.+              -- static files.
    /iframely           -- API endpoint with get params - returns oEmbed/2 JSON.
    /debug              -- debugger UI with get params.
    /reader.js          -- API endpoint with get params - returns script to render article.
    /render             -- API endpoint with get params - returns custom rendered widget.
    /meta-mappings      -- API endpoint with available unified meta.

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

`TODO: publish method + doc on iframely.getPageData` (+shortcuts to fetch only oembed or else)

`TODO: publish method + doc on iframely.getImageMetadata`


---------------------------------------


### Using REST API

#### /iframely

This is actually oEmbed/2 endpoint.

**Method:** GET

**Params:**
 - `uri` - page uri to be processed.
 - `disableCache` - disables getting data from cache if `true`.
 - `debug` - includes plugin debug info if `true`.
 - `mixAllWithDomainPlugin` - if `true` - uses all generic plugins if domain plugin available, see [domain plugins](#domain-plugins) for details.

**Returns:** JSON, see [example](http://dev.iframe.ly/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063).

Description of result:

    {
      "meta": {                                         -- Unified meta object, see description in next section.
        "title": "BLACK&BLUE",                          -- Page title attribte.
        ...
      },
      "links": [                                        -- Array of links which can be rendered.
        {
          "href": "//player.vimeo.com/video/67452063",  -- URI of link.
          "type": "text/html",                          -- MIME type of link content.
          "rel": [                                      -- Array of link semantic types.
            "player",                                   -- "player" - is widget playing some media.
            "iframely"                                  -- "iframely" - custom widget generated by iframely.
          ],
          "title": "BLACK&BLUE",                        -- Usual html link title attribute, equals meta.title.
          "media": {                                    -- "media query" semantics to provide widget media properties.
            "aspect-ratio": 1.778                       -- This means widget is proportionally resizable.
          }
        },
        ...
      ]
    }

Idea of unified 'meta' and 'links' item specific attributes are described in following sections.

---------------------------------------

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

---------------------------------------

##### links

Following sections will describe available link attributes values.

###### MIME types

Generally MIME type defines method to render link as widget.

There are following types for now:
 - `"text/html"` - this could be rendered as `<iframe>`.
 - `"application/javascript"` - JavaScript widget with dynamic page embedding with `<script>` tag.
 - `"text/x-safe-html"` - this is internal type for plugins. It will be converted to `"application/javascript"`. That will be script which dynamically renders html on page. See [x-safe-html](#x-safe-html) for details.
 - `"application/x-shockwave-flash"` - flash widget, will be rendered with `<iframe>`.
 - `"video/mp4"` - html5 video. Will be rendered with `<iframe>`. TODO: render with `<video>` tag.
 - `"image"` - this is image which will be rendered with `<img>` tag. Following types - is specified image format. If format is not specified engine will try to detect it by fetching image head.
 - `"image/jpeg"`
 - `"image/icon"`
 - `"image/png"`
 - `"image/svg"`

---------------------------------------

###### rel

Rel is semantic keyword describing meaning of link.

Usually it should be used to find better link for rendering in specific cases.

 - **player** - wiget which plays video or music or slideshow.
 - **thumbnail** - small image.
 - **image** - large (not small) image.
 - **reader** - reading widget (article or some info).
 - **file** - downloadable file.
 - **iframely** - link is custom generated by iframely [domain plugin](#domain-plugins).
 - **instapaper** - article extracted using instapaper classes.
 - **og** - link extracted from opengraph semantics.
 - **twitter** - link extracted from twitter semantics.
 - **oembed** - link extracted from oembed/1 semantics.
 - **icon** - link with favicon.
 - **logo** - link with site log.

---------------------------------------

###### media

Plugins uses following media query attributes (meaning follows from name):

 - **width**
 - **width-min**
 - **width-max**
 - **height**
 - **height-min**
 - **height-max**
 - **aspect-ratio** - available only if **width** and **height** not present

Note: **-min** and **-max** values are not currently fully supported by iframely.js.

---------------------------------------

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

---------------------------------------

#### /reader.js

Endpoint for article rendering scripts.

**Method:** GET

**Params:**
 - `uri` - page uri to be processed.

**Returns:** JavaScript widget to render article.

This is behind scenes endpoint. It is not directly used by developer.
Link to endpoint is automatically generated for internal MIME type `"text/x-safe-html"`.
See [x-safe-html](#x-safe-html) for details.

Endpoint will return JavaScript widget to embed it with `<script>` tag.
Embedding will be completed by [iframely.js](#javascript-client-lib-iframelyjs) lib.

---------------------------------------

#### /render

Endpoint to cusrom rendered widgets.

**Method:** GET

**Params:**
 - `uri` - page uri to be processed.

**Returns:** html page with widget.

This is behind scenes endpoint. It is not directly used by developer.
Link to endpoint is automatically generated for internal MIME type `"text/html"` with `template_context` or `template` attributes provided by plugin.
See [rendering templates](#rendering-templates) for details.

Result will be embedded with `<iframe>`. Embedding and resizing will be completed by [iframely.js](#javascript-client-lib-iframelyjs) lib.

---------------------------------------


### JavaScript client lib iframely.js

Iframely can be used from client application using `/static/js/iframely.js` client script. It provides shortcuts to fetch data from `/iframely` API endpoint and render links.

#### Deploy on your page

Insert following lines in your page head:

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
    <script type="text/javascript" src="https://raw.github.com/itteco/iframely/master/static/js/iframely.js"></script>

You should copy `iframely.js` script file to your static dir and change path properly.

To support proportional size iframes add following styles:

    <style>
        .iframely-container iframe {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .iframely-container {
            position: relative;
            left: 0px;
            width: 100%;
            height: 0px;
        }
    </style>

This will allow youtube, vimeo and similar players to be resized by container where they are placed and keep their proportion.

#### Fetching oEmbed/2

    // Setup endpoint path.
    $.iframely.defaults.endpoint = 'http://your.iframely.server.domain/iframely';

    // Start data fetching. Specify page uri and result callback.
    $.iframely.getPageData("http://vimeo.com/67452063", function(error, data) {
        console.log(data);
    });

This code will create following [log](http://dev.iframe.ly/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063):

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


If you want to make `reader` iframes to be without horizontal scrolling call after rendering widgets:

    $.iframely.registerIframesIn($('body'));

You can call it once after all or after each rendering operation.

This is useful with [github.gist](http://dev.iframe.ly/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[storify](http://dev.iframe.ly/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages,
where js widget is inserted in iframe and we don't know exact size before it launched.
After widget is rendered, custom script in that iframe sends message to parent about new window size.
So iframely.js will resize that iframe to fit content without horizontal scrolling.


---------------------------------------


### Writing plugins

**Terms**

 - **plugin** - node.js module.
 - **plugin method** - function in that plugin.
 - **plugin method requirements** - named params of that function.
 - **URI** - page URI on wich iframely search links and meta.

Plugins are node.js modules with attributes and functions defined by iframely engine:

 - **mixins** - list of plugins' to use with domain plugin. Plugins identified by its file name without extension and path.
 - **re** - list or single RegExp for testing page URI.
 - **getLink** - method to generate link.
 - **getLinks** - method to generate links array.
 - **getMeta** - method to create page unified meta.
 - **getData** - this method generates data, which can be used by other plugins and methods (getMeta, getLink(s) and getData).
 - **tests** - array of test urls to test plugin work. This is not used yet.
 - **lowestPriority** - marks plugin's getMeta method with low priority.
 - **highestPriority** - marks plugin's getMeta method with highest priority.

`TODO: add links to sections`

Main work is done by plugins' methods getMeta, getLink(s) and getData. These methods work similar but returns
different kind of objects (hashes). Each method has a number of params, called **requirements**. For example:

    getLink: function(meta, oembed) {
        return {
            title: oembed.title,
            description: meta.description
        };
    }

`getLink` uses **meta** and **oembed** params, so they are method's **requirements**.

Iframely engine know that by parsing module code and provides that parameters when method is called.
If some requirements are not available, method will not be called. This means all defined method params ara mandatory requirements.
Here is the list of all available default requirements:

 - **urlMatch** - variable got after matching page URI against **re** RegExpes attribute of plugin. This is available only if domain plugin which has **re** attribute is used.
 - **url** - page URI itself.
 - **request** - known [request module](https://github.com/mikeal/request), wrapped with caching (caching not implemented yet). This is useful to call some external APIs' methods.
 - **meta** - parsed paged meta head. You can see how page meta is parsed in [debugger, "Plugins context" section](http://dev.iframe.ly/debug?uri=http%3A%2F%2Fvimeo.com%2F67452063).
 - **oembed** - parsed oembed 1.0 (if available for page).
 - **html** - entire page response decoded to UTF-8.
 - **$selector** - jquery wrapper of page. Useful for fast accessing some page data by element class, e.g. `$selector('.item').text()`.
 - **cb** - this is result callback. If method requires **cb** - it means method is asynchronous. Engine will wait calling of **cb**. Without **cb** - method must return object synchronously.

Plugin can provide custom requirements using **getData** method. See [plugin.getData](#plugingetdata) for details.

Here is engine algorithm to work with plugins:

 1. Extract URI domain (e.g. `example.com`).
 2. Find suitable domain plugins for that URI.
    1. If domain plugins found:
        1. Check if domain plugins has **re** attribute.
            1. If true:
                1. Match all RegExp'es against URI and create urlMatch variable.
                2. Use only plugins with matched **re**s.
                3. If no matched plugins found - use domain plugins without **re**.
                4. If all plugins has **re** and no matches found - use all generic plugins.
            2. If false:
                1. Use all domain plugins.
    2. If suitable domain plugins **not** found:
        1. Use all generic plugins.
 3. Find methods of selected plugins to call:
    1. Iterate all used plugins:
        1. Itarate all plugin methods:
            1. If method has only default requirements (see list below) - use it.
            2. If method has custom requirements (provided by some getData method) - skip it.
 4. Load page by URI and get all required variables (meta, oembed, html etc.). If no requirements - page will not be loaded.
 5. Go through all selected (used) methods.
    2. Call method with selected params.
    3. Wait for **cb** called if method is asynchronous or get result immediately.
    4. Store received result or error.
 6. Find methods with custom requirements which can be called with received data (from previous step).
    1. If methods found - go to step 5.
 7. Extract all links from saved data:
    1. Generate info for links with [type: "x-safe-html"](#x-safe-html)
    2. Generate info for links with [custom render](#rendering-templates)
    3. Calculate images sizes and type if not provided.
    4. Filter links without `href`.
    5. Resolve href to URI (if relative path provided).
    6. Skip duplicate links (by `href`).
    7. Combine `http://` and `https://` similar links to one without protocol `//`.
 8. Merge all **meta** to single object (data from highest priority plugins will override others).
 9. Return **links** and **meta**.

#### Plugin structure

##### plugin.getLink(s)

##### plugin.getMeta

`getMeta` function allow plugin to provide some page meta attributes.

Look at all meta plugins at: [/plugins/generic/meta](https://github.com/itteco/iframely/tree/master/plugins/generic/meta).

Names of attributes should be unified. Do not created different forms of one attribute name, like `author_url` and `author-url`.
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

###### plugin.getMeta priorities

Some plugins may return same meta attributes. This is possible if one attribute is described using different semantics.
It happens that values of these attributes are different. We know some semantics are better then other.
For example: html `<title>` tag often provides page title with site name, which is not really part of content title.
But `og:title` usually better and contains only article title without site name.

If you want to mark you plugin as worst source of meta (like html `<title>` tag), use `lowestPriority: true`:

    module.exports = {
        lowestPriority: true
    }

If you want to mark your plugin as good source of meta (like og:title), use `highestPriority: true`:

    module.exports = {
        highestPriority: true
    }

So resulting priority of meta plugins will be following:

 1. plugins with `highestPriority: true` will override all others plugins meta data.
 1. meta from plugins without priority mark will override only `lowestPriority: true` plugins meta data.
 1. data from plugins with `lowestPriority: true` will be used only if no other plugin provides that meta data.

##### plugin.getData

##### plugin.mixins

##### plugin.tests



#### Type of plugins

##### Generic plugins

[/plugins/generic](https://github.com/itteco/iframely/tree/master/plugins/generic)


###### Meta plugins

[/plugins/generic/meta](https://github.com/itteco/iframely/tree/master/plugins/generic/meta)


##### Domain plugins

[/plugins/domains](https://github.com/itteco/iframely/tree/master/plugins/domains)


##### Custom plugins

[/plugins/generic/custom](https://github.com/itteco/iframely/tree/master/plugins/generic/custom)


##### Template plugins

[/plugins/templates](https://github.com/itteco/iframely/tree/master/plugins/templates)


#### Custom links cases

##### x-safe-html

##### Rendering templates.

##### Resize embedded iframe from inside iframe.

