# Iframely API for Responsive Web Embeds

Iframely is fast and simple HTTP API for responsive web embeds. It also can be used as Node.js library. 

HTTP API are available as [oEmbed](https://iframely.com/docs/oembed-api) or [Iframely API](https://iframely.com/docs/iframely-api) formats. Iframely formats basically mimics the `<head>` section of the page with its `meta` and `links` elements.

In response to `url` request, APIs returns you the embeds and meta for a requested web page. Below are samples from [hosted API](https://iframely.com), just to show you the format:

[>> Here’s API call for Coub video](http://iframe.ly/ACcM3Y.json)
[>> Same one, but as oEmbed](http://iframe.ly/ACcM3Y.oembed)

Iframely does it by parsing [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards) and general meta on the original page. Or by using specific domain plugins in the package. 

There are over 150 custom domains included as open-source. Plus, there is a whitelist option that acts like a gigantic plugin for generic parsers. You can [create your own whitelist]() or [get one](https://iframely.com/plans) with [over 1600 domains](https://iframely.com/try) from Iframely. By default, our whitelist with Top 100 domains is included for free with your package. 

## Read Next:

 - [Try Iframely Demo with any Twitter feed](https://iframely.com/try)
 - [API in Iframely format](https://iframely.com/docs/iframely-api) (`iframe=true` option is only available for hosted API)
 - [API in oEmbed format](https://iframely.com/docs/oembed-api)
 - [About Link Rels, Types and Media Queries](https://iframely.com/docs/links) (players, thumbnails, app, reader, survey, slideshow, etc)
 - [META semantics](https://iframely.com/docs/meta) Iframely API scrapes for you.
 - [How to install & configure](https://iframely.com/docs/host) your open-source host. 

## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions. Our support email is support at iframely.com

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you are a publisher and would like to make your embeds available under [Iframely Protocol](http://iframely.com/oembed2) (and thus distributed through this open-source gateway) - please, [add your domain to the our DB](http://iframely.com/qa/request).



## License & Authors

MIT License. (c) 2012-2014 Itteco Software Corp. 

Specifically:

- [Nazar Leush](https://github.com/nleush) - _the_ author
- [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.

