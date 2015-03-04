# oEmbed API

Iframely gives you a classic [oEmbed](http://oembed.com) v1 endpoint, where you send a URL and get embed codes in response. The HTML embed codes will be responsive, if possible.

Read details of oEmbed on [http://oembed.com](http://oembed.com).  Basically, you just want to look for `html` field of response. However beware, `photo` type in oEmbed gives image resource as `url` field rather than in `html`.

This article gives you all you need to know about oEmbed implementation in Iframely. All other articles will relate to [Iframely API](https://iframely.com/docs/iframely-api).

## API Request

[>> http://iframe.ly/api/oembed?url=… &api_key= …](http://iframe.ly/api/oembed?url=http://iframe.ly/ACcM3Y).

 - `url` and `api_key` parameters are required. 
 - `url` needs to be URL-encoded.
 - `api_key` isn’t required if URL is from `iframe.ly/*` domain. 


If you're making API calls via JavaScript, and your site uses SSL, change API address to `https://`. For server-server communications, HTTP is generally faster as it doesn't require additional handshakes.

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

`photo`, `video` and `rich` types are supported as oEmbed output. If Iframely doesn't have any embed codes for a given URL, oEmbed will return `link` type object. 