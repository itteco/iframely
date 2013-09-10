## API Reference


### /iframely API endpoint

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

