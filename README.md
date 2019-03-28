# Iframely API for Responsive Web Embeds

This is the self-hosted version of Iframely's APIs and parsers. 

Iframely gives your fast and simple API for responsive web embeds and semantic meta. The parsers cover well [over 1800 domains](https://iframely.com/domains) through 200+ custom domain plugins and generic support for [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards), that are powered by Iframely's whitelist. 

The whitelist file is pulled from iframely.com database and is updated automatically. The whitelisting is manual process on our end. You can also [have your own whitelist](https://iframely.com/docs/whitelist-format) file. 

HTTP APIs are available in [oEmbed](https://iframely.com/docs/oembed-api) or [Iframely API](https://iframely.com/docs/iframely-api) formats. To make it simple to understand, Iframely format mimics the `<head>` section of the page with its `meta` and `links` elements.

In response to `url` request, APIs returns you the embeds and meta for a requested web page. Below are data samples from [hosted API](https://iframely.com), just to show you the format:

- [>> Here’s API call for Coub video](http://iframe.ly/ACcM3Y.json)
- [>> Same one, but as oEmbed](http://iframe.ly/ACcM3Y.oembed)

Iframely can also be used as Node.js library (that's how it is used in our [cloud API](https://iframely.com)). 

Requires Node version 0.10.22 and up. 


## Not included as compared to Cloud API

Hosted [cloud APIs](https://iframely.com) add optional iFrame renders and number of widgets such as cards, GIF support, player events, AMP, and others. Our [more/less](https://iframely.com/docs/more-less) toggle for per-URL customizations, predictive height mechanism for non-iFrame embeds, lazy-loading, type-based whitelist and fallbacks as well as number of other customizations is only available in the cloud. 

This open-source version provides the web parsers only, though hosted API uses data from parsers as-is. The API endpoints between the version should match format pretty closely, though there might be minor discrepancies.

There's also a bunch of domain parsers that are not included in self-hosted version. Those are the parsers that we consider vulnarable for changes on publisher's origin servers and so requiring quicker turnaround time for any updates and fixes.


## Get started:

To get started with the APIs: 

 - Your API endpoints will be at `{your.server}/iframely?url=` and `{your.server}/oembed?url=`
 - [How to install & configure](https://iframely.com/docs/host) your Iframely host.  
 - [API in Iframely format](https://iframely.com/docs/iframely-api)
 - [API in oEmbed format](https://iframely.com/docs/oembed-api)
 - [About Link Rels, Types and Media Queries](https://iframely.com/docs/links) in Iframely format (players, thumbnails, app, reader, survey, slideshow, etc)
 - [META semantics](https://iframely.com/docs/meta) Iframely API scrapes for you.
 - Visual debug tool included in the package is at `{your.server}/debug`



## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions. Our support email is support at iframely.com

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you see an error in our domains whitelist (you can [debug URLs here](http://iframely.com/debug)), please ping us and we'll fix it in no time.


## License & Authors

MIT License. (c) 2012-2017 Itteco Software Corp. [Nazar Leush](https://github.com/nleush), [Ivan Paramonau](https://twitter.com/iparamonau)

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.

