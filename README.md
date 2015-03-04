# Iframely API for Responsive Web Embeds

Iframely is fast and simple HTTP API for responsive web embeds and semantic meta. The API covers well [over 1600 domains](https://iframely.com/try) through 150 custom domain plugins and generic parsers for [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards), powered by Iframely's whitelist. 

The whitelisting is manual process, and we do every-day manual regression testing to ensure integrity. [Submit your domain](https://iframely.com/qa/request), if you publish embeds.

HTTP API are available as [oEmbed](https://iframely.com/docs/oembed-api) or [Iframely API](https://iframely.com/docs/iframely-api) formats. To make it simple to understand, Iframely format mimics the `<head>` section of the page with its `meta` and `links` elements.

In response to `url` request, APIs returns you the embeds and meta for a requested web page. Below are samples from [hosted API](https://iframely.com), just to show you the format:

- [>> Here’s API call for Coub video](http://iframe.ly/ACcM3Y.json)
- [>> Same one, but as oEmbed](http://iframe.ly/ACcM3Y.oembed)

Iframely can also be used as Node.js library. 
Requires Node version 0.10.22 and up. 

## Get started:

The simplest way to see Iframely in action is by using our [Chrome plugin](https://chrome.google.com/webstore/detail/iframely-url-previews/bbafbcjnlgfbemjemgliogmfdlkocjmi). This way you will see the embeds on your (or any really) site right away (but not on GitHub due to Content-Security-Policy, sorry). 

Or, [try Iframely demo with your very own or any other Twitter feed](https://iframely.com/try). Don't forget to click on results to see the embed codes.

To get started with the APIs: 

 - There's a hosted version of these APIs at [iframely.com](https://iframely.com), if you'd rather rely on the cloud
 - [API in Iframely format](https://iframely.com/docs/iframely-api) (`iframe=true` option is only available for hosted API)
 - [API in oEmbed format](https://iframely.com/docs/oembed-api)
 - [About Link Rels, Types and Media Queries](https://iframely.com/docs/links) in Iframely format (players, thumbnails, app, reader, survey, slideshow, etc)
 - [META semantics](https://iframely.com/docs/meta) Iframely API scrapes for you.
 - [How to install & configure](https://iframely.com/docs/host) your open-source host. 


## Use APIs in your open-source project

We have provided specific endpoint for the use in open source projects. Read more at [oembedapi.com](http://oembedapi.com).



## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions. Our support email is support at iframely.com

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you see an error in our domains whitelist (you can [debug URLs here](http://iframely.com/debug)), please ping us and we'll fix it in no time.


## License & Authors

MIT License. (c) 2012-2015 Itteco Software Corp. 

Specifically:

- [Nazar Leush](https://github.com/nleush) - _the_ author
- [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.

