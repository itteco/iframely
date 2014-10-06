# Iframely API for Responsive Embeds

You send Iframely an URL via HTTP GET request. Iframely will return you semantics `meta` and embeds `links`, which both can be imagined as the `<head>` elements of the web page requested. 

Iframely will generate those elements from a variety of sources, including oEmbed, Twitter Cards and Open Graph. 

Embed codes are given in `html` values for each link or, for the primary media option only, duplicated at the root level. 

## API Request

[>> http://iframe.ly/api/iframely?url=… &api_key= …](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - `api_key` isn’t required if URL is from `iframe.ly/*` domain. 

## API Response

[>> Here’s Iframely API response for Coub](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y)


    {
        "id": "ACcM3Y",                 -- short ID if you request iframe=true
        "url": "http://coub.com/view/2pc24rpb",

		-- rel use cases and html  code for primary variant of embed,
		"rel": ["player", "ssl"],	-- check it for `autoplay` if you request it
		"html": "<div style=\"left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;\"><iframe src=\"//coub.com/embed/2pc24rpb\" style=\"top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;\"></iframe></div>"

        "meta": {                       -- meta object with the semantics
            "title": "PARADISE BEACH",  -- e.g. title and others
            "description": "Ilya Trushin",
            "author_url": "http://coub.com/trucoubs",
            "author": "Ilya Trushin",
            "site": "Coub",
            "canonical": "http://coub.com/view/2pc24rpb",
            "keywords": "living photo, ... , media"        
        },

        -- Plus list of embed src links with functional rels . For example,
        "links": {
            "player": [{                -- List of player embed widgets
                "media": {              -- Media query aspects
                    "aspect-ratio": 1.777778
                },
                                        -- SRC of embed.
                "href": "//coub.com/embed/2pc24rpb",
                "rel": ["player", "ssl", "html5"],
                "type": "text/html"     -- link’s MIME type
                -- Plus generated HTML code for simplicity of use.
                "html": "<div style=\"left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;\"><iframe src=\"//coub.com/embed/2pc24rpb\"  style=\"top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;\"></iframe></div>"
            }, {
                ... 
                -- Might have multiple variations of the same player. 
                -- E.g. one that 'autoplay's, one as MP4 video, one with https src.
            }],
            "thumbnail": [{
                "media": {
                    "height": 360,      -- Exact sizes here. 
                    "width": 640
                },                      -- We repeat the same rel
                "rel": ["thumbnail"],   -- as iframely.js needs it.
                "type": "image",        -- "use href as src of image"
                "href": "http://cdn1.aka ... med_1381670134_00040.jpg"
            }, {
                ...
            }],

                                   		-- Also possible:
                                        -- app, image (as rel)
            ...                         -- reader, survey
                                        -- logo (sometimes)
            "icon": [{
                ...
            }]
        },


`rel` is the primary information about the use case of the embeds. 
Might be Player, Thumbnail, App, Image, Reader, Survey, icon and logo. [See the detailed description of rels](https://iframely.com/docs/rels). 

`meta` will contain list of semantic attributes in unified naming format. 
See the list of [what Iframely might produce as meta](https://iframely.com/docs/meta).

Array values that only have one element will be wrapped as single object (i.e. without `[]`).


## Optional request parameters

Additional options can be requested as `get` parameters:

 - `iframe=true` or `iframe=1` - for the use with [URL shortener](https://iframely.com/docs/url-shortener) and will return the hosted iframes or [summary cards](https://iframely.com/docs)
 - `autoplay=true` or `1` - will give preference to `autoplay` media and will try to return it as primary `html`. Check for `autoplay` in primary `rel` to verify.
 - `ssl=true` or `1` - will return only embeds that can be completely shown under HTTPs (so not falling back to Iframely summary cards)
 - `html5=true` or `1`- will return only embeds that can be viewed on mobile devices or desktops without Flash plugin installed
 - `maxwidth=` in pixels will return only embeds that do not exceed the desired width
 - `origin=` - text value, representing your hashtag of the URL, if you later want to filter it in your desktop. E.g. chat room name, if you got a chat app
 - `callback` - JavaScript function, if you’d like response to be wrapped as JSONP.

## Error handling

Iframely will return HTTP error code if HTTP error occurred. It can be `404` for not found resource, `401` or `403` for webpages with authorization, `408` if the origin service takes too much time to respond and times-out, etc. 

The body of the response will also contain error code and message.