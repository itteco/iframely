## API Reference

- [/iframely: _the_ API endpoint](#iframely-api-endpoint)
    - [meta](#meta)
    - [links](#links)
        - [MIME types](#mime-types)
        - [rel](#rel)
        - [media](#media)
- [iframely.js: JavaScript client lib](#iframelyjs-javascript-client-lib)
    - [Add to your page](#add-to-your-page)
    - [Fetch oEmbed/2](#fetch-oembed2)
    - [Render links](#render-links)
- TODO: [Using Iframely as npm package](#using-iframely-as-npm-package)

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
 - `min-width`
 - `max-width`
 - `height`
 - `min-height`
 - `max-height`
 - `aspect-ratio` - available only if **width** and **height** not present
 - `orientation`


### iframely.js: JavaScript client lib
[iframely-js]: #iframelyjs-javascript-client-lib

Iframely package includes the client wrapper over the API, so you don't need to spend time on it yourself. 
You may access it in `/static/js/iframely.js` folder. It provides calls to fetch data from `/iframely` API endpoint and render links.

#### Add to your page

Insert similar lines in your page head (iframely.js requires jQuery and Underscore):

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
    <script type="text/javascript" src="http://your.domain/r3/js/iframely.js"></script>

Replace `your.domain` with your actual domain name. You may also copy `iframely.js` script file to your apps main domain and accordingly.

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
        var $el = $.iframely.generateLinkElement(link, data);

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