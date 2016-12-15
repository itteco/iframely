# Iframely API endpoint

You send Iframely an URL via HTTP GET request. Iframely will return you semantics and attribution `meta` data and embeds `links`. Together, they mimic the `<head>` element of requested web page.

Embed codes are given in `html` values for each link or, for the primary media option only, duplicated at the root level. Embed codes will be wrapped into responsive divs whenever possible.

## API Request

[>> http://iframe.ly/api/iframely?url=… &api_key= …](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - for enhanced security, `api_key` can be substituted with `key` parameter, which should be the md5 hash value of your API key. 


If you're making API calls via JavaScript, and your site uses SSL, change API address to `https://`. For server-server communications, HTTP is generally faster as it doesn't require additional handshakes.

## API Response

[>> Here’s sample Iframely API response for Coub](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y)


    {
        "id": "ACcM3Y",         // short URL ID, if available
                                // plus canonical URL
        "url": "http://coub.com/view/2pc24rpb",

		// rel use cases and html code for primary variant of embed,
		"rel": ["player", "ssl"], // check for `autoplay` if you request it
		"html": "<div ... </div>"

        // meta object with attribution semantics
        "meta": {
            "title": "PARADISE BEACH",
            "description": "Ilya Trushin",
            "author_url": "http://coub.com/trucoubs",
            "author": "Ilya Trushin",
            "site": "Coub",
            "canonical": "http://coub.com/view/2pc24rpb",
            "keywords": "living photo, ... , media"        
        },

        // Plus list of embed src links with functional rels . For example,
        "links": {
            "player": [{        // List of player embed widgets
                "media": {      // Media query, e.g. aspects
                    "aspect-ratio": 1.777778
                },
                
                // SRC of embed.
                "href": "//coub.com/embed/2pc24rpb",

                // functional and technical use cases.
                "rel": ["player", "ssl", "html5"],

                // link’s MIME type, says "embed as iFrame".
                "type": "text/html", 

                // plus generated HTML code for simplicity of use:
                "html": "<div ... </div>"
            }, {
                ... 
                // Might have multiple variations of the same player. 
                // Say, one that 'autoplay's, one as MP4 video, one as https.
            }],
            "thumbnail": [{
                "media": {
                    "height": 360,      // Exact sizes here. 
                    "width": 640
                },                      // We repeat the same rel
                "rel": ["thumbnail"],   // as iframely.js needs it.
                "type": "image",        // "use href as src of image"
                "href": "http://cdn1.aka ... med_1381670134_00040.jpg"
            }, {
                ...
            }],

                                        // Also possible:
                                        // app, image (as rel)
            ...                         // reader, survey
                                        // logo (rare)
            "icon": [{
                ...
            }]
        },


 - `rel` is the primary information about the use case of the embeds. Primary rels are `player`, `thumbnail`, `app`, `image`, `reader`, `survey`, `summary`, `icon` and `logo`. [See detailed description of rels](https://iframely.com/docs/links). 

 - `meta` will contain list of semantic attributes in unified naming format. Read what Iframely unifies as [meta semantics here](https://iframely.com/docs/meta).


Array values that only have one element will be wrapped as single object (i.e. without `[]`).


*For open source users:*

 - The API response format of [Iframely open-source](https://github.com/itteco/iframely) is a little different by default as it does not have the links array grouped by rel. This is for legacy reasons. To achieve exact same grouped response as in Cloud API, add `&group=true` to your request or configure it in your settings.
