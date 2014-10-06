# oEmbed API

Iframely gives you classic [oEmbed](http://oembed.com) endpoint, where you send a URL and get embed codes in response. The HTML embed codes will be responsive, if possible.

Read details of oEmbed on [http://oembed.com](http://oembed.com).  Basically, you just want to look for `html` field of response. However beware, `photo` type in oEmbed gives image resource as `url` field rather than in `html`.

This article gives you all you need to know about oEmbed implementation in Iframely. All other articles will relate to [Iframely API](https://iframely.com/docs/iframely-api).

## API Request

[>> http://iframe.ly/api/oembed?url=… &api_key= …](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - `api_key` isn’t required if URL is from `iframe.ly/*` domain. 

## API Response

[>> Here’s oEmbed response for Coub](http://iframe.ly/ACcM3Y.oembed)

	{
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
	}

`photo`, `video` and `rich` types are supported as oEmbed output. If Iframely doesn't have any embed codes for given URL, oEmbed will return `link` type object. The additional unified semantic information as well as `thumbnail`s are returned for all URLs. See the list of meta fields below.

## Optional request parameters

Additional options can be requested as `get` parameters:

 - `iframe=true` or `iframe=1` - for the use with [URL shortener](https://iframely.com/docs/url-shortener) and will return the hosted iframes or [summary cards](https://iframely.com/docs)
 - `ssl=true` or `1` - will return only embeds that can be completely shown under HTTPs (so not falling back to Iframely summary cards)
 - `html5=true` or `1`- will return only embeds that can be viewed on mobile devices or desktops without Flash plugin installed
 - `maxwidth=` in pixels will return only embeds that do not exceed the desired width
 - `origin=` - text value, representing your hashtag of the URL, if you later want to filter it in your desktop. E.g. chat room name, if you got a chat app
 - `callback` - JavaScript function, if you’d like response to be wrapped as JSONP.

Please note that there is no `autoplay` filter for our oEmbed API endpoint. It never returns the media that autoplays. 

## Error handling

Iframely will return HTTP error code if HTTP error occurred. It can be `404` for not found resource, `401` or `403` for webpages that need authorization, `408` if the origin service takes too much time to respond and times-out, etc. 

The body of the response will also contain error code and message