## Quick Intro

[Iframely](http://iframely.com) is super fast web parsing API that gives your app responsive embed codes of web URLs. 

Like YouTube and Vimeo players, Instagram photos, Twitter Statuses, Google Maps, and others you see on blogs and social apps out there. Plus thumbnails, titles and other meta data for any URL.  [Here’s some samples](http://iframely.com/domains).

Iframely’s open-source package covers over 100 specific domains off-the-shelf, plus generic _oEmbed_, _Twitter Cards_ and _Open Graph_ parsers.  You can easily extend it by developing your own plugins.  There's also optional readability parser.

## Domain plugins included

Here's the list of domains that package includes specific plugins for:

AngelList, CNN, College Humor, Facebook, Flickr, Funny or Die, Huffington Post, Pinterest, Google Plus, The Globe and Mail, The Guardian, The Onion, Travel Channel, Tumblr (including custom domains), 500px, 56.com, 9Gag, About.me, Animoto, Bandcamp, Behance, Blip.tv, Bravo TV, BrightCove (including hosted), CodePen, Droplr, DailyMotion, DotSUB, Dribbble, Ebaums World, Eurocommision, Eventbrite, all Gawker domains (Lifehacker, Gizmodo, etc.) - for those who use Readability plugin, Getty Images, Giphy, GitHub Gists, Gogoyoko, Haiku Deck, Hulu, Imgur, Instagram, Issuu, iTunes, JSFiddle, Keek, Kickstarter, Live Wall Street Journal, Liveleak, Livestream, Lockerz, Lolwall, Magnatune, Mail.ru, Google Maps, Metacafe, MixBit, Mixcloud, MyVideo.de, Official.fm, Open Street Map, Ow.ly, Pastebin, Path, PBS.org, PollDaddy, Prezi, QZ, Rdio, Tapestry, Reuters, Revision3, Yahoo Screen, Screencast, Screenr, Scribd, Slid.es, Slidecaptain, Sliderocket, Smugmug, Socialcam, Someecards, Soundcloud, Speakerdeck, Spotify, Spreecast, Storify, TED, Telly, Tindeck, Tinypic, Trutv, Twitpic, Twitter, Ustream, QQ, Vevo, Vid.ly, Viddler, Viddy, MIT videos, Yandex.ru,  NYmag videos, Vimeo, Vine.co, Visual.ly, VK.com, Vube.com, weheartit, Wistia, WordPress, yFrog, Youku, Youtube.


## Extend with Domains DB

You can extend the coverage of generic open-source parsers to over 1500 domains with the help of Iframely Domains DB. 

We manually test, regression-test and whitelist domains that publish embeds either oEmbed, Twitter Cards or Open Graph protocols. The database is available for $99, and its easily pluggable into Iframely Gateway. 

[Get Domains DB here.](http://iframely.com/qa)

By default, your open-source installation will be linked to our [TOP 100](http://iframely.com/qa/sample.json) free domains list. If you feel like, create your own whitelist file [following this format](http://iframely.com/gateway/dbformat). 



## Or use as Cloud API

Iframely is also available as Cloud API. 

It is the same great API (plus all 1500+ whitelisted domains), but without the need of your own hardware. It acts as the web shortener (we give you short ID of the URL in the database), and is available for just $29/mo. 

[Sign up here.](http://iframe.ly) 



## Iframely protocol (oEmbed/2)

Iframely API can consume embeds published under Iframely Protocol (oEmbed/2). It is based on oEmbed, RDFa and HTML5 (namely, media queries) and is focused on responsive embeds and functional use cases.  

If you are a publisher, learn [more about the protocol here](http://iframely.com/oembed2). And [add your domain here](http://iframely.com/qa/request). Also list your domain if you just publish in oEmbed v1, Twitter players or Open Graph video.



## Get started with API

To get started with API, read [API Docs](http://iframely.com/gateway/API) or use our visual [URL Checker](http://iframely.com/debug). 

[>> Here’s a sample API call for Vimeo video](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)

Essentially, the API’s JSON data format emulates `meta` representation of URL’s  `head` and `link rel=…` list of responsive embeds, as if domain actually published in Iframely Protocol. 

Iframely API is also available as oEmbed v1, for the ease of your migration.

You may jump start your development by using our [Cloud API](http://iframe.ly)  (which is nearly identical to open-source) with the free plan. 

Or [read here how to install](http://iframely.com/gateway/setup) and configure gateway yourself. 



## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions.

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you are a publisher and would like to make your embeds available under [Iframely Protocol](http://iframely.com/oembed2) (and thus distributed through this open-source gateway) - please, [add your domain to the our DB](http://iframely.com/qa/request).



## License & Authors

MIT License. (c) 2012-2014 Itteco Software Corp. 

Specifically:

- [Nazar Leush](https://github.com/nleush) - _the_ author
- [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.

[![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

