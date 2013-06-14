# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 self-hosted embeds server. 
Iframely package saves you months of dev time on rich content parsers. So you can focus on enriching your users’ experience instead.

Iframely is Node.JS app (and/or package), but you can access it from other environments via API.
Main endpoint (see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):

    /iframely?uri={url encoded http link to a web page}


Iframely provides out-of-the-box:
 - Generic parsers of [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and Readability articles
 - Caching for performance optimizations 
 - API for unified/merged meta, thumbnails (incl sizes), video, players, articles
 - Plugins arсhitecture to extend the logic or to implement custom domain parsers
 - 100+ parsers for specific domains (well, it'll be so very soon)


Iframely is based on [oEmbed/2][oembed2]:
 - Name it "oEmbed two" or "half oEmbed", because - 
 - It removes the semantics part of [oEmbed](http://oembed.com) out of the scope of the spec (as there is plenty of `meta` available already on the page)
 - Keeps the discovery part through `<link>` tag in the `<head>` of the page
 - And specifies technological approaches and use case for embeds to improve end user's experience in modern realities (HTML5, CSS3, HTTP1.1)


(c) 2013 Itteco Software Corp. Licensed under MIT.

If you use this software, we'd love to hear from you. Give us a shout on Twitter [@iframely](https://twitter.com/iframely) and spread the word. 

## Jump To

- [oEmbed/2 quick draft][oembed2]
- [Community API endpoint at iframely.com/iframely][community-api]
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

[oEmbed spec](http://oembed.com) was remarkable and ingenious in 2008. It was unlocking numerous opportunities for developers and businesses alike. 
All of a sudden, as a publisher you could get enormous distribution of your content into all the apps (and their user base) that consume it per spec.

For app developers it meant they could provide significantly more engaging user experience and higher value to better retain their customers. However, due to inconsistencies in implementations, security considerations and lack of progress on semantics part, the progress towards a movable web stumbled.

oEmbed/2 eliminates the semantic part of [oEmbed](http://oembed.com) as other semantic protocols such as [Open Graph]((http://ogp.me/)) and RDFa in general have clearly gone mainstream. Besides, there is plenty of other `<meta>` data, available for a web page. 

Thus, oEmbed/2 is primarily for discovery of what publisher has got to offer and agreeing on the use cases.

**Discovery is expected to happen when publisher puts `<link>` tag in the head of their webpage:**


    <link rel="player twitter"            // intended use case
    type="text/html"                      // embed as iframe
    href="//iframe.ly/234rds"             // with this src
    media="min-width: 100"                // when these sizes are ok
    title="Thanks for all the fish!" >    


- The use cases shall be listed in `rel` attributed, separated by a space. The dictionary of use cases is not fixed, and it is up to publisher and provider to choose what to publish or consume. 
Iframely endpoint can currently output the following `rel` functional use cases: `favicon`, `thumnail`, `image`, `player`, `reader`, `logo`. In addition, we supplement with `rel` indicating origin, such as `twitter` for example.

- `type` attribute of a link specified the MIME type of the link, and so dicttes the way the embed resources shall be embedded. Iframely supports embeds as iframe, image and javascript.

- `href` attributes is preferrably via https protocol to ensure maximum distribution for publishers' content, as consumers may opt not to consider http-only embeds.

- `media` is for media queries, indicating the sizes of the containers where embed content would fit. 


As a "good citizen" policy and business etiquette, it is worth to remind that both consumer and publisher work together towards a common goal of providing the best user experience possible for their shared audience, and not against each other in order to solicit a customer. Never should it be acceptable to undermine user experience in lieu of providing value.

This is a draft idea. More specific description will be published once we gather sufficient feedback from the community.

## Community API endpoint at iframely.com/iframely
[community-api]: #community-api-endpoint-at-iframelycomiframely

__Please note__: You may use skip installation and use community endpoint to rapidly develop against it:

    http://iframely.com/iframely?uri=

The visusal debug tool is at [http://iframely.com/debug](http://iframely.com/debug).

This endpoint is provided courtesy of Itteco and has the latest version of iframely deployed. It is subject to restarts and rate-limits and thus is not suitable for production use. 

Please deploy iframely on your own hardware before going live.


## Server setup

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

__Important__: At the very least, you need to enter your own application keys and secret tokens where applicable. 


### Run server

Starting server is simple. From iframely home directory:

    node server

We highly recommend [forever](https://github.com/nodejitsu/forever) though as it makes stopping and restarting of the servers so much easier:

    npm install -g forever
    forever start -l iframely.log server.js


### List of server urls

You may need to configure these in your reverse proxy settings, depending on your setup:

    /r/.+               -- static files (including iframely.js client library).
    /iframely           -- main API endpoint with get params - returns oEmbed/2 as JSON.
    /debug              -- debugger UI with get params.
    /reader.js          -- API endpoint with get params - proxies script to render article.
    /render             -- API endpoint with get params - prexies custom widgets if required.
    /meta-mappings      -- API endpoint with available unified meta.

### Server debug tool

You can visualize server API with debug tool at:

 - [http://localhost:8061/debug](http://localhost:8061/debug), try [example](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)

If your local configuration turns debug mode on, the debug tool will also show the debug information for the plugins used (useful when developing plugins - see Wiki for how to write plugins)

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
 - `uri` - (required) URI of the page to be processed.
 - `refresh` - (optional) You can request the cache data to be ingored by sending `true`. Will unconditionally re-fetch the original source page.

**Returns:** JSON, see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063).

Description of result:

    {
      "meta": {                                         -- Unified meta object, see description in next section.
        "title": "BLACK&BLUE",                          -- Page title attribte.
        ...
      },
      "links": [                                        -- Array of links which can be rendered.
        {
          "href": "//player.vimeo.com/video/67452063",  -- URI of link. If both http and https are available, starts with `//`
          "type": "text/html",                          -- MIME type of link content.
          "rel": [                                      -- Array of link semantic types.
            "player",                                   -- `player` - is widget playing some media.
            "iframely"                                  -- `iframely` - indicates custom code of Iframely:
                                                            in this example, we added responsive `aspect-ratio` and `//` 
          ],
          "title": "BLACK&BLUE",                        -- Usual html link title attribute, equals meta.title.
          "media": {                                    -- "media query" semantics to provide widget media properties.
            "aspect-ratio": 1.778                       -- This means widget is responsive and proportionally resizable.
          }
        },
        ...
      ]
    }

Idea of unified 'meta' and 'links' item specific attributes are described in following sections.

---------------------------------------

#### meta

Most web pages have organic `<meta>` data using different semantics: twitter, og, meta, dublin core, parsely, sailthru, etc.

Iframely merges different semantics into fields with unified consistent naming, so you can reliably use them (if they are present, of course).

Iframely `meta` object may contain the following keys at the moment:

General meta:
 - `title`
 - `description`
 - `date` (the publication date)
 - `canonical` - canonical URL of the resource 
 - `shortlink` - URL shortened through publisher
 - `category`
 - `keywords`

Attribution:
 - `author`
 - `author_url` 
 - `copyright`
 - `license`
 - `license_url`
 - `site`
 
Stats info: 
 - `views` - number of views on the original host
 - `likes`
 - `comments`
 - `duration` (in seconds, duration of video or audio content)


Geo (as per Open Graph spec):
 - `country-name`
 - `postal-code` 
 - `street-address`
 - `region`
 - `locality`
 - `latitude`
 - `longitude`

All current attributes are listed in `/meta-mappings` endpoint.

---------------------------------------

#### links

Following sections will describe available link attributes values.

##### MIME types

Generally MIME type defines method to render link as widget.

MIME type is an expected http response "content-type" of data behind '"href"'. Type of content defines rendering method.

There are following types for now:
 - `"text/html"` - this could be rendered as `<iframe>`.
 - `"application/javascript"` - JavaScript widget with dynamic page embedding with `<script>` tag.
 - `"text/x-safe-html"` - this is an internal type for plugins. It will be converted to `"application/javascript"` delivered through iframely's `/render.js` endpoint.
 - `"application/x-shockwave-flash"` - flash widget, will be rendered with `<iframe>`.
 - `"video/mp4"` - html5 video. Will be rendered with `<iframe>`. TODO: render with `<video>` tag.
 - `"image"` - this is image which will be rendered with `<img>` tag. Below are the specific image types. If format is not specified engine will try to detect it by fetching image head.
  - `"image/jpeg"`
  - `"image/icon"`
  - `"image/png"`
  - `"image/svg"`

---------------------------------------

##### `rel`

`Rel` is for intended use case of the link.

Usually it should be used to find better link for rendering in specific cases.
 - `player` - wiget which plays video or music or slideshow. E.g. it could be `"text/html"` page with embedded media.
 - `thumbnail` - small image.
 - `image` - large (not small) image.
 - `reader` - reading widget (article or some info).
 - `file` - downloadable file.
 - `icon` - link with favicon.
 - `logo` - link with site's logo. Is returned mostly for pages with the news article (custom ones) for better attribution

Iframely uses supplementary `rels` as the way of attributing to the origin of the data:
 - `iframely` - link or attributes are customly altered by iframely through one of the domain plugin. Consider it a whitelist.
 - `readability` or `instapaper` - article extracted using instapaper classes.
 - `og` - link extracted from opengraph semantics. Beware, `players` rendered through `og` have higher chance of being unreliable. 
 - `twitter` - link extracted from twitter semantics.
 - `oembed` - link extracted from oembed/1 semantics.

You would need to make a decision wheather you want to trust specific origins or not.

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

Iframely package includes the client wrapper over the API, so you don't need to spend time on it yourself. 
You may access it in `/static/js/iframely.js` folder. It provides calls to fetch data from `/iframely` API endpoint and render links.

#### Add to your page

Insert similar lines in your page head (iframely.js requires jQuery and Underscore):

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
    <script type="text/javascript" src="http://your.domain/r3/js/iframely.js"></script>

Replace `your.domain` with your actual domain name. You may also copy `iframely.js` script file to your apps main domain and accordingly.

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

This code will create following [log](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063):

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

This is useful with [github.gist](http://iframely.com/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or
[storify](http://iframely.com/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages,
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


Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to submit an issue.
Fork and do a pull-request, if you'de like to add more plugins and/or contribute fixes or improvements. 

If you are a publisher and would like to make your embeds available as [oEmbed/2][oembed2] (and thus delivered through iframely) - please, do get in touch or [cast your email here](http://iframely.com).