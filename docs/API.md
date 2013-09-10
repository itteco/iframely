# Iframely Gateway API Reference

Iframely Gateway is powerful self-hosted endpoint, simple API for responsive embed widgets and meta. It returns JSON object with all parsed embed and semantic meta data for the requested URL. 

You host the API on your own servers and domain. The primary endpoint is `/iframely?uri=`:

    http://{YOURHOST.HERE}/iframely?uri={url encoded http link to a web page}

(see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063))



## Main `/iframely` API Endpoint

**Method:** GET. 

**Params:**

 - `uri` - (required) URI of the page to be processed.
 - `refresh` - (optional) You can request the cache data to be ingored by sending `true`. Will unconditionally re-fetch the original source page.
 - `group` - (optional) You can add the extra parameter "group=true" to use different output in JSON - the records groupped by link rel. See below.

**Returns:** JSON, see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063).

**Format:** Result has the following structure:

    {
      "meta": {                                         -- meta object with the unified semantics
        "title": "BLACK&BLUE",                          -- e.g. title and others
        ...
      },
      "links": [                                        -- List of embed widgets
        {
          "href": "//player.vimeo.com/video/67452063",  -- SRC of embed. 
          "type": "text/html",                          -- MIME type of embed method.
          "rel": [                                      -- List of functional use cases. For example,
            "player"                                    -- `player` - is widget with media playback
          ],
          "title": "BLACK&BLUE",                        -- different titles, for different content on the page
          "media": {                                    -- "media query" semantics to indicate responsive sizes
            "aspect-ratio": 1.778                       -- e.g. fluid widget with fixed aspect ratio
          }
        },
        ...
      ]
    }

Please, refer to [Iframely Protocol](http://iframely.com/oembed2) to get the idea of embeds via `<link>` element.



## Unified and Merged META

Most web pages have organic `<meta>` data published using different semantics standards and optimized for different platforms. For example, oEmbed, Open Graph, Twitter Cards, core HTML meta for Google, Dublin Core, Parsely, Sailthru, etc.

[Iframely Gateway](http://iframely.com/gateway) merges various semantics into fields with unified consistent naming keys, so you can reliably use them in your app (if they are present, of course).

Iframely API returns `meta` object that may contain the following keys at the moment:


### General meta:

 - `title`
 - `description`
 - `date` (the publication date)
 - `canonical` - canonical URL of the resource 
 - `shortlink` - URL shortened through publisher
 - `category`
 - `keywords`

### Attribution:

 - `author`
 - `author_url` 
 - `copyright`
 - `license`
 - `license_url`
 - `site`
 
### Stats info:

 - `views` - number of views on the original host, e.g. YouTube
 - `likes`
 - `comments`
 - `duration` (in seconds, duration of video or audio content)


### Geo data (as per Open Graph spec):

 - `country-name`
 - `postal-code` 
 - `street-address`
 - `region`
 - `locality`
 - `latitude`
 - `longitude`

### Product info (per Pinterest spec):

`price`
`currency_code`
`brand`
`product_id`
`availability`
`quantity`


You can get all current attributes are listed in `/meta-mappings` endpoint.



## List of Embed Widget Links

`links` is the list of objects with keys `rel`, `href`, `type` and `media`. 

You can generate embed codes for it as referenced in [Iframely Protocol](http://iframely.com/oembed2/types) spec.


### Values of `rel`

`rel` object contains an array of functional use cases. You need to chose link with `rel` which is better suiteable for your apps functionality.

 - `player` - widget with media playback. Like video or music or slideshow players
 - `thumbnail` - the preview image
 - `image` - sizeable image, indicating that this is the main content on the web page. For use in e.g. photo albums "details" page
 - `reader` - text or graphical widget intended for reader functionality (e.g. article)
 - `file` - downloadable file
 - `icon` - attribution favicon or glyph
 - `logo` - logo the source site. Is returned mostly for pages with the news article (custom ones) for better attribution

Iframely uses supplementary `rels` as the way of attributing to the origin of the data:

 - `readability` or `instapaper` - article extracted using instapaper classes.
 - `og` - link extracted from Open Graph markup. Beware, `players` rendered through `og` have higher chance of being unreliable. 
 - `twitter` - link extracted from Twitter Cards semantics.
 - `oembed` - link extracted from oEmbed/1 object.

You would need to make a decision wheather you want to trust specific origins or not or use [Iframely Whitelist File](http://iframely.com/qa).


### MIME `type`

Generally MIME type defines method to render link as widget.

MIME type is an expected HTTP response "content-type" of data behind '"href"'. Type of content defines rendering method.

There are following `type`s at the moment:

 - `"text/html"` - widget needs to be rendered as `<iframe>`.
 - `"application/javascript"` - JavaScript widget with dynamic page embedding with as `<script>`.
 - `"application/x-shockwave-flash"` - Flash widget, will be rendered with `<iframe>`.
 - `"video/mp4"` - HTML5 video. Will be rendered with as `<video>`.
 - `"image"` - this is image which will be rendered with as `<img>`. Below are the specific image types. If format is not specified, the engine will try to detect it by fetching image's descriptors.
  - `"image/jpeg"`
  - `"image/icon"`
  - `"image/png"`
  - `"image/svg"`


### `media` query

Media section is for media query. Iframely generates attributes as well as puts it into usable JSON.

You can use [iframely.js](http://iframely.com/gateway/iframelyjs) to render responsive widgets.

Plugins use the following media query attributes at the moment:

 - `width`
 - `min-width`
 - `max-width`
 - `height`
 - `min-height`
 - `max-height`
 - `aspect-ratio` - available only if **width** and **height** not present

