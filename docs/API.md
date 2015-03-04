# Iframely API for Responsive Embeds and Unified Meta

You send Iframely an URL via HTTP GET request. Iframely will return you semantics `meta` and embeds `links`, which both mimic the `<head>` elements of the web page requested. 

Iframely will generate those elements from a variety of sources, including oEmbed, Twitter Cards, Open Graph, microformats and custom domain parsers. 

Embed codes are given in `html` values for each link or, for the primary media option only, duplicated at the root level. The embed codes will be wrapped into responsive divs whenever possible.

## API Request

[>> http://iframe.ly/api/iframely?url=… &api_key= …](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - `api_key` isn’t required if URL is from `iframe.ly/*` domain. 


If you're making API calls via JavaScript, and your site uses SSL, change API address to `https://`. For server-server communications, HTTP is generally faster as it doesn't require additional handshakes.

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


 - `rel` is the primary information about the use case of the embeds. Primary rels are Player, Thumbnail, App, Image, Reader, Survey, Summary, Icon and Logo. [See the detailed description of rels](https://iframely.com/docs/links). 

 - `meta` will contain list of semantic attributes in unified naming format. See what Iframely unifies as [meta semantics](https://iframely.com/docs/meta).


Array values that only have one element will be wrapped as single object (i.e. without `[]`).


*For open source users:*

 - The API response format of [Iframely open-source](https://github.com/itteco/iframely) is a little different by default as it does not have the links array grouped by rel. This is for legacy reasons. To achieve exact same grouped response as in Cloud API, add `&group=true` to your request.
