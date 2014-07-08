# Iframely API Endpoints


## For both Cloud and Open-Source versions of API

[Iframely API can return](http://iframely.com/docs) either full JSON with the list of embed links, or a simple response as oEmbed. 

Each of the JSON response formats has it’s own API Endpoint relative address and set of get parameters:

- [/iframely?url=](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y) - for full Iframely JSON,
- [/oembed?url=](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y) - for simple oEmbed format. 

Depending on whether you use Iframely Cloud API, or Open-Source API, the primary (absolute) host paths will also differ. 

- All endpoints are called using `GET` HTTP methods. 
- All URLs need to be URL-encoded.
- All endpoints can accept optional `callback` parameter for JSONP support.


## Cloud API

The API host for Iframely Cloud is at `http://iframe.ly/api`

### Shorten and get ID or HTML

Iframely Cloud acts as the database for links and URL shortener. Each endpoint is treated as the way for you to shorten URLs and add it to your database. Iframely cloud will add `id` value to the root of API JSON. Repeat requests will return the same ID.  

- [http://iframe.ly/api/iframely?url={URL}&api_key={KEY}&origin={hashtag}](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y) <br>- for full Iframely JSON,
- [http://iframe.ly/api/oembed?url={URL}&api_key={KEY}&origin={hashtag}](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y) <br>- for simple oEmbed format.

`api_key` is required, unless URL is from iframe.ly domain itself, like `?url=http://iframe.ly/ACcM3Y`. ([Get your FREE one here](http://iframe.ly))  

`origin` parameter is optional. You can filter URLs on your dashboard using origin as #hashtag.

The response will contain embed links and other meta right away, along with the short `id` for future reference. If you're using [Cloud API](http://iframe.ly), the response will also contain `html` of a hosted widget so that you don't need to render the embed code yourself. 


### Get URL data by ID

When you shorten a URL, you’ll get `id` in the response. This is the short ID of the URL in Iframely DB, unique to your account. 

The short URL (with UI, if any) will be [http://iframe.ly/{SHORT ID}](http://iframe.ly/ACcM3Y.json). This is its permanent address.

To query data about this URL any time, you can make public HTTP calls to 

- [iframe.ly/{SHORT ID}.json](http://iframe.ly/ACcM3Y.json) for `iframely` JSON format
- and to [iframe.ly/{SHORT ID}.oembed](http://iframe.ly/ACcM3Y.oembed) for `oembed` format. 

The queries to this direct JSON objects do not count towards your plan’s limits. 


## Open Source API

The exact path to your Open Source API host depends on your config and setup you have in reverse-proxy. 

Basically, it is:

- [{YOURHOST.HERE}/iframely?url=](http://iframe.ly/api/iframely?url=http://iframe.ly/ACcM3Y) - for full Iframely JSON,
- [{YOURHOST.HERE}/oembed?url=](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y) - for simple oEmbed format. 

The only differences in JSON format with Cloud API is the absence of `id` value and also the fact that full Iframely JSON is not grouped by `rel` in Open-Source API. To get it grouped, just add `&group=true` to the response. The open-source API also does not have `html` field, so you'd need to generate the embed codes yourself, depending on your app needs. [See how](http://iframely.com/docs/links).


Also, see [how to install & configure](http://iframely.com/docs/host) your Open-Source host. 

## Read Next:

- [About Link Rels, Types and Media Queries](http://iframely.com/docs/links) (players, thumbnails, app, reader, survey, slideshow, etc)
- [See more sample URLs and demos](http://iframely.com/domains)
- [Get your Cloud API Key](http://iframe.ly/api)
- [How to install & configure](http://iframely.com/docs/host) your open-source host. 
