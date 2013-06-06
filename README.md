# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 self-hosted embeds server. 
Iframely package saves you months of dev time on rich content parsers. So you can focus on enriching your users’ experience instead.

Iframely is Node.JS app (and/or package), but you can access it from other environments via API.
Main endpoint (see [example](http://dev.iframe.ly/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):

    /iframely?uri={url encoded http link to a web page}


Iframely provides out-of-the-box:
 - Generic parsers of [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and Readability articles
 - Caching for performance optimizations 
 - API for unified/merged meta, thumbnails (incl sizes), video, players, articles
 - Plugins arсhitecture to extend the logic or to implement custom domain parsers
 - 100+ parsers for specific domains (well, it'll be so very soon)


Iframely is based on [oEmbed/2][oembed2]:
 - Name it "oEmbed two" or "half oEmbed"
 - It removes the semantics part of the spec
 - Leaves the discovery part through `<link>` tag
 - And specifies technological approaches and use case for embeds to improve end user's experience in modern realities


(c) 2013 Itteco Software Corp.
License is TBD. We envision free for non-commercial use, and a fee for commercial use.

## Jump To

- [oEmbed/2 quick draft][oembed2]
- [Server setup](#server-setup)
    - [Installation](#installation)
    - [Config](#config)
    - [Run server](#run-server)
    - [List of server urls](#list-of-server-urls)
    - [Server debug tool](#server-debug-tool)
    - [Update iframely](#update-iframely)
- [API Reference](#api-reference)
    - [/iframely: _the_ API endpoint][iframely]
        - [meta](#meta)
        - [links](#links)
            - [MIME types](#mime-types)
            - [rel](#rel)
            - [media](#media)
    - [iframely.js: JavaScript client lib][iframely-js]
        - [Add to your page](#add-to-your-page)
        - [Fetch oEmbed/2](#fetch-oembed2)
        - [Render links](#render-links)
    - TODO: [Using Iframely as npm package](#using-iframely-as-npm-package)
- [Contributing & Contact Us](#contributing-and-contact-us)

See WIKI for further reading.    

## oEmbed/2 quick draft
[oembed2]: #oembed2-quick-draft "oEmbed/2 draft"

oEmbed/2 eliminates the semantic part of [oEmbed](http://oembed.com) as other semantic protocols such as [Open Graph]((http://ogp.me/)) and RDFa in general have clearly gone mainstream. Besides, there is plenty of other `<meta>` data, available for a web page. 

Thus, oEmbed/2 is primarily for discovery of what publisher has got to offer:

    <link rel="oembed"            // use case
    type="text/html"              // iframe
    href="//iframe.ly/234rds"     // src
    media="min-width: 100"        // sizes
    title="Thanks for all the fish!" >

Each embed representation should have it's own `<link>` in the head of HTML document. 

- The use cases shall be listed in `rel` attributed, separated by a space. The dictionary of use cases is not fixed, and it is up to publisher and provider to choose what to publish or consume. 
Iframely endpoint currently can output the following `rel` use cases: `favicon`, `thumnail`, `image`, `player`, `reader`, `logo`.

- `type` attribute of a link specified the MIME type of the link, and so dicttes the way the embed resources shall be embedded. Iframely supports embeds as iframe, image and javascript.

- `href` attributes is preferrably via https protocol to ensure maximum distribution for publishers' content, as consumers may opt not to consder http-only embeds.

- `media` is for media queries, indicating the sizes of the containers where embed content would fit. 


As a "good citizen" policy and business etiquette, it is worth to remind that both consumer and publisher work together towards a common goal of providing the best user experience possible for their shared audience, and not against each other in order to solicit a customer. Never should it be acceptable to undermine user experience in lieu of providing value.

## Server setup

__Please note__: You may use skip installation and use community endpoint at [http://dev.iframe.ly/iframely] to rapidly develop against it. 
This endpoint is subject to frequent restarts and rate-limits and thus is not suitable for production use. Please deploy iframely on your own server later on.

### Security considerations

It is highly recommended that you install the server on a separate domain. There are few cases, when rendering of embed content is required by the server, for example the articles. Even though iframely tries to eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain.

### Installation

Node.js versions 0.8-0.10 required. Install if from [pre-built installer](http://nodejs.org/download/) for your platform or from [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

It will also install all the package dependencies.

If you're using Mac OS, you might need to install ImageMagic CLI tools to make image size detection work. 

### Config

Please, create your local config file to adjust settings. This local config file will be ignored when you update versions from Git later on.

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Edit the sample config file as you need. You may also override any values from main config.js in your local config.
There are some provider-specific values you might want to configure (e.g. wheather to include media in Twitter status embeds).
You can also fine-tune API response time by disabling image size detection or readability parsing. Plus, we'll put some security configuration options there in a near future. 

__Important__: At the very list you need to enter your own application keys and secret tokens where applicable. 


### Run server

Starting server is simple. From iframely home directory:

    node server

We highly recommend [forever](https://github.com/nodejitsu/forever) though as it makes stopping and restarting of the servers so much easier:

    npm install -g forever
    forever start -l iframely.log server.js


### List of server urls

You may need to configure these in your reverse proxy settings, depending on your setup:

    /r3/.+              -- static files (including iframely.js client library).
    /iframely           -- main API endpoint with get params - returns oEmbed/2 as JSON.
    /debug              -- debugger UI with get params.
    /reader.js          -- API endpoint with get params - proxies script to render article.
    /render             -- API endpoint with get params - prexies custom widgets if required.
    /meta-mappings      -- API endpoint with available unified meta.

### Server debug tool

You can visualize server API with debug tool at:

 - [http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)

If your local configuration turns debug mode on, the debug tool will also show the debug information for the plugins used (useful when [developing plugins](#writing-plugins))

### Update iframely

As we keep adding features, you may want to update your server. The domain providers due to dependencies to 3rd parties do break from time to time, and we'll release hot fixes in this case. Please, follow [Iframely on Twitter](http://twitter.com/iframely) to get timely heads up when hot fixes are required.

To update a package to it's latest version run in iframely home directory:

    git pull
    
and restart your server. If you use forever, run:

    forever restartall

## API Reference

### /iframely API endpoint
[iframely]: #iframely-api-endpoint

This is the actual oEmbed/2 gateway endpoint and the core of Iframely.

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

#### meta

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

#### links

Following sections will describe available link attributes values.

##### MIME types

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

##### `rel`

`Rel` is for inteded use case of the link.

Usually it should be used to find better link for rendering in specific cases.
 - `player` - wiget which plays video or music or slideshow.
 - `thumbnail` - small image.
 - `image` - large (not small) image.
 - `reader` - reading widget (article or some info).
 - `file` - downloadable file.
 - `icon` - link with favicon.
 - `logo` - link with site's logo. Is returned mostly for pages with the news article (custom ones) for better attribution

Iframely uses supplementary `rels` as the way of attributing to the origin of the data:
 - `iframely` - link is customly generated by iframely through [domain plugin](#domain-plugins). Consider it a whitelist.
 - `instapaper` - article extracted using instapaper classes.
 - `og` - link extracted from opengraph semantics. Beware, `players` rendered through `og` have higher chance of being unreliable. 
 - `twitter` - link extracted from twitter semantics.
 - `oembed` - link extracted from oembed/1 semantics.

---------------------------------------

##### `media`

Media section is for media query. Iframely generates attributes as well as puts it into usable JSON.

Plugins use the following media query attributes at the moment:

 - `width`
 - `width-min`
 - `width-max`
 - `height`
 - `height-min`
 - `height-max`
 - `aspect-ratio` - available only if **width** and **height** not present
 - `orientation`


### iframely.js: JavaScript client lib
[iframely-js]: #iframely-js-javascript-client-lib

Iframely includes the client wrapper over the API, so you don't need to spend time on it yourself. 
You may access it as `/static/js/iframely.js`. It provides calls to fetch data from `/iframely` API endpoint and render links.

#### Add to your page

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

#### Fetch oEmbed/2

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

#### Render links

Each link in result from previous example can be rendered:

    // Iterate through all links.
    data.links.forEach(function(link) {

        // Call generator to create html element for link.
        var $el = $.iframely.generateLinkElement(link);

        // Add element to body.
        $('body').append($el);
    });


If you'd like to make `reader` iframes to be without horizontal scrolling call after rendering widgets:

    $.iframely.registerIframesIn($('body'));

You can call it once after all or after each rendering operation.

This is useful with [github.gist](http://dev.iframe.ly/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[storify](http://dev.iframe.ly/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages,
where js widget is inserted in iframe and we don't know exact size before it launched.
After widget is rendered, custom script in that iframe sends message to parent about new window size.
So iframely.js will resize that iframe to fit content without horizontal scrolling.



### Using Iframely as npm package

Install:

    npm install iframely

Usage:

    var iframely = require("iframely");

`TODO: doc on iframely.getRawLinks`

`TODO: publish method + doc on iframely.getPageData` (+shortcuts to fetch only oembed or else)

`TODO: publish method + doc on iframely.getImageMetadata`


## Contributing and Contact Us

The authors of the package are these guys from [Itteco](http://itteco.com):
 - [Nazar Leush](https://github.com/nleush) - _the_ author
 - [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Once we figure out the exact licensing for the package, we will welcome contributions, and especially for specific domain providers. 

In the meantime, please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to submit an issue.



