# Iframely Gateway for Responsive Embeds

[We](http://itteco.com) believe the responsive embeds is the future of the Web. 

Iframely is advanced self-hosted embeds API to help you join the future. In response to `url` request, it gives  responsive embeds data and semantic meta for a requested web page.

[Here’s a quick API call for Vimeo video](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)

In a sense, Iframely is a self-hosted oEmbed endpoint, with slightly extended data format and adjusted HTML part to facilitate responsive widgets.

Iframely is a Node.JS app, though API is HTTP-based and you can use it from within any environments.

## Features

- HTTP API for meta semantics, thumbnails (including sizes), photo images, video players and readers.
- `oembed` endpoint for easy migration of existing implementations (it is a fallback though and thus not as powerful as main API).
- Generic parsers for [Iframely Protocol](http://iframely.com/oembed2), [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and optional Readability articles.
- Over _100 parsers_ for specific domains, like YouTube, Vimeo, SoundCloud, Instagram, Facebook, Imgur, etc.
- Plugins infrastructure to extend the logic or to implement additional domain or generic parsers.
- Built-in caching for performance optimizations (Memcached, Redis or in-memory engines).

Last, but not least:

- [Domains Whitelist](http://iframely.com/qa/buy) file that acts as gigantic plugin to extend coverage to 2000+ domains.

Domains QA is how we make money to keep maintaining this project. Thanks for your support and understanding.

## How-to

To jump start with Iframely, we suggest you [try our visual debug tool](http://iframely.com/debug) where you can check any URL and see embed codes.

Next: 

- [Get started with API](http://iframely.com/gateway/API);
- [Use iframely.js jQuery lib](http://iframely.com/gateway/iframelyjs)  that wraps the API and renders embeds;
- Or [render a responsive widget yourself](http://iframely.com/oembed2/types);
- [Host your own server](http://iframely.com/gateway/setup);
- Understand API format or publish embed (aka [Iframely Protocol for Responsive Embeds](http://iframely.com/oembed2));
- [Get our Domains QA DB](http://iframely.com/qa)
- Or [create your own whitelist](http://iframely.com/qa/format).

You may skip some steps and jump right into coding by using our community endpoint, hosted at [http://iframely.com/iframely?uri=](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063). It’s not recommended for production use as we continuously run experiments on that server.

## Sample Apps & Demos

Some cool demos are on the way. In the meantime, try some standalone apps Itteco developed on top of Iframely technology (well, it was more "in parallel with", actually):

* [iframe.ly](http://iframe.ly) -  convenient web shortener
* [Nowork FM](http://nowork.fm) - simple social intranet for your team
* [Iframely for Gmail](https://chrome.google.com/webstore/detail/iframely-for-gmail/bbafbcjnlgfbemjemgliogmfdlkocjmi) (as seen on Lifehacker, PC World & others) - watch videos, view photos and read articles in your inbox.


## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions.

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you are a publisher and would like to make your embeds available under [Iframely Protocol](http://iframely.com/oembed2) (and thus distributed through this open-source gateway) - please, [add your domain to the our DB](http://iframely.com/qa/request).



## License & Authors

MIT License. (c)2012-2014 Itteco Software Corp. 

Specifically:

- [Nazar Leush](https://github.com/nleush) - _the_ author
- [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.

[![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)



