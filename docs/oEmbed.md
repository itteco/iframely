# oEmbed API endpoint

Iframely gives you a classic [oEmbed v1](http://oembed.com) endpoint, where you send your URL and get embed codes in response. The HTML embed codes will be responsive in most cases, whenever possible.

Read details of oEmbed spec on [oembed.com](http://oembed.com). Basically, you just want to look for `html` field of API response. However beware, `photo` type of oEmbed gives image resource as `url` field rather than as `html`.

This article gives you all you need to know about oEmbed implementation in Iframely. All other articles will relate to more detailed [Iframely API](https://iframely.com/docs/iframely-api) format.

## API Request

[>> http://iframe.ly/api/oembed?url=… &api_key= …](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - for enhanced security, `api_key` can be substituted with `key` parameter, which should be the md5 hash value of your API key. 


If you're making API calls via JavaScript, and your site uses SSL, change API address to `https://`. For server-server communications, HTTP is generally faster as it doesn't require additional handshake.

## API Response

[>> Here’s sample oEmbed response for Coub](http://iframe.ly/ACcM3Y.oembed)

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
	    "html": "<div style=\"left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.243%;\"><iframe src=\"//coub.com/embed/2pc24rpb\" style=\"top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;\"></iframe></div>",
	}

`photo`, `video` and `rich` types are supported as oEmbed output. If Iframely doesn't have any embed codes for a given URL, oEmbed will return `link` type object. 