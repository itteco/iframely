Iframely is fast HTTP API for responsive web embeds. Open-source and self-hosted, or available in the cloud. Here’s [all ways to get Iframely](http://iframely.com/get). 

In response to `url` request, Iframely API returns you the embeds links and semantic meta for a requested web page. It does so by parsing [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards) and general meta on the original page. 


## Full API JSON

[>> Here’s a quick API call for Coub video](http://iframe.ly/ACcM3Y.json)

Basically, it mimics the `<head>` of the origin page, with `<meta>` and list of `<links>` to embed widgets:


    {
        "id": "ACcM3Y",                 -- short ID of a link
        "url": "http://coub.com/view/2pc24rpb",

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
                "media": {              -- Mostly responsive
                    "aspect-ratio": 1.777778
                },
                                        -- SRC of embed. The main attribute.
                "href": "//coub.com/embed/2pc24rpb",
                "rel": ["player", "iframely"],
                "type": "text/html"     -- MIME type. Tells: "use iframe here".
            }, {
                ... 
                -- Can be multiple variations of the same player. 
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
                                        -- app, image (as rel)
            ...                         -- reader, survey
                                        -- logo (sometimes)
            "icon": [{
                ...
            }]
        },
    }



## Or in oEmbed Format

Iframely comes with oEmbed adapter. It can return embeds as oEmbed JSON, though it is more of a fallback and is slightly less flexible than main endpoint. For example, it skips `autoplay` videos.

[>> Here’s the same Coub in oEmbed flavor](http://iframe.ly/ACcM3Y.oembed)

	{
	    "id": "ACcM3Y",
	    "url": "http://coub.com/view/2pc24rpb",
	    "type": "rich",
	    "version": "1.0",
	    "title": "PARADISE BEACH",
	    "author": "Ilya Trushin",
	    "author_url": "http://coub.com/trucoubs",
	    "provider_name": "Coub",
	    "thumbnail_url": "http://cdn1 ... /med_1381670134_00040.jpg",
	    "thumbnail_width": 640,
	    "thumbnail_height": 360,
	    "html": "<div class=\"iframely-widget-container\" style=\"left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.243%;\"><iframe class=\"iframely-widget iframely-iframe\" src=\"//coub.com/embed/2pc24rpb\" frameborder=\"0\" allowfullscreen=\"true\" webkitallowfullscreen=\"true\" mozallowfullscreen=\"true\" style=\"top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;\"></iframe></div>",
	    "duration": 12,
	    "keywords": "living photo, cinemagraph, ... , media",
	    "description": "Ilya Trushin",
	    "canonical": "http://coub.com/view/2pc24rpb"
	}

`photo` and `rich` types are supported as oEmbed output. If Iframely doesn't have any embed codes for given URL, oEmbed will return `link` type object. The additional unified semantic information as well as `thumbnail`s are returned for all URLs. See the list of meta fields below.


## Read Next:

 - [See more sample URLs and demos](http://iframely.com/domains)
 - [API Endpoints](http://iframely.com/docs/api)
 - [About Link Rels, Types and Media Queries](http://iframely.com/docs/links) (players, thumbnails, app, reader, survey, slideshow, etc)
 - [Unified META semantics](http://iframely.com/docs/meta) Iframely API scrapes for you.
 - [How to install & configure](http://iframely.com/docs/host) your Open-Source host. 


## Help & Support 

If you need any quick help, don’t hesitate to tweet to [@iframely](https://twitter.com/iframely) or [send an email](mailto:support@iframely.com).


