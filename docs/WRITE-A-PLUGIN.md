This documents needs to be cleaned up and finalized.

## Write a Plugin

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

Example:

    tests: [
        {
            feed: "http://gdata.youtube.com/feeds/api/videos"
        },
        {
            pageWithFeed: "http://www.businessinsider.com/"
        },
        {
            page: "http://500px.com/upcoming",
            selector: ".title a",
            getUrl: function(url) {
                return url.indexOf('ok') > -1 ? url : null;            
            }
        },
        {
            geturls: function(cb) {
                var request = require('request');
                request({
                    url: 'https://api.domain.com/items',
                    json: true
                }, function(error, body, data) {
                    if (error) {
                        return cb(error);
                    }
                    if (!data || !data.urls) {
                        return cb('No urls in API data');
                    }
                    cb(null, data.items.slice(0, 10));
                });
            }
        }
        {
            skipMixins: ["og-title"],
            skipMethods: ["getLink"]
        },
        "http://www.youtube.com/watch?v=etDRmrB9Css"
    ]

Feeds:
 * `feed` - rss/atom feed of links to test.
 * `pageWithFeed` - "home" page with rss/atom link in page header, feed will be looked for links to test.
 * `page` and `selector` - jquery selector on page to find `a` elements with `href` attribute with links to test.
 * `getUrl(url)` - this function allows to change or mark feed url as not usable by returning `null`.
 * `getUrls(cb)` - this function allows to provide async method to load urls from any custom source. `cb(error, urls)` - waits for error or urls array.

Testing directives:
 * `skipMethods` - array of non mandatory plugin methods. If method will not return data - it will be test warting, not error. Exceptions will raise error as usual.
 * `skipMixins` - same as previous, but with mixin methods.

If you have test urls but there are no test feeds, specify following to prevent test warnings:

    tests: [
        {
            noFeeds: true
        },
        "http://www.youtube.com/watch?v=etDRmrB9Css"
    ]

If there are no any test urls, write:

    tests: {
        noTest: true
    }

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


##### Rendering templates.

##### Resize embedded iframe from inside iframe.