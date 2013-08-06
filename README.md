# Iframely Embeds Gateway

[http://iframely.com](http://iframely.com)

[![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

Iframely is self-hosted embeds gateway, giving you single endpoint to get rich embeds data of any URL. 

Iframely is Node.JS app (and/or package), but you can access it from other environments via API.
Main endpoint (see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):

    /iframely?uri={url encoded http link to a web page}


Iframely provides out-of-the-box:

 - Generic parsers of [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and Readability articles
 - Caching for performance optimizations (Memached, Redis or in-memory engines)
 - API for unified/merged meta, thumbnails (incl sizes), video, players, articles
 - Plugins arсhitecture to extend the logic or to implement custom domain parsers
 - More than 100 parsers for specific domains, like YouTube, Vimeo, Soundcloud, Instagram, etc.


(c) 2013 Itteco Software Corp. Licensed under MIT.

_Itteco also is developing additional services for developers and publishers, which will help us finance the maintenance of this open-source project. Please, [submit your email here](http://iframely.com) to get notified and support our effort._


## Getting Started

### Do not forget :)

- To give Iframely a star on GitHub
- To [follow Iframely on Twitter](https://twitter.com/iframely) or watch this repo to get updates


### Community Endpoint

__Please note__: You may use skip installation and use community endpoint to rapidly develop against it:

    http://iframely.com/iframely?uri=

This endpoint is provided courtesy of Itteco and has the latest version of iframely deployed. It is subject to restarts and rate-limits and thus is not suitable for production use. 

Please deploy iframely on your own hardware before going live.


### Quick API Response Intro

In response to `/iframely?uri=` requests, Iframely will return JSON with the embed links and unified meta semantics.


Response structure is close resemblance of the following analogue of `<head>` part of the URL's page:

    <head>
        <meta name="..." value="..."/>
        <link rel="iframely player" href="..." type="text/html" media="aspect-ratio: 1.778" title="...">
    </head>

JSON response will look like:

    {
      "meta": {                                         -- Unified meta object, see description in next section.
        "title": "BLACK&BLUE",                          -- Page title attribte.
        ...
      },
      "links": [                                        -- Array of links which can be rendered.
        {
          "href": "//player.vimeo.com/video/67452063",  -- URI of link. If both http and https are available, starts with `//`
          "type": "text/html",                          -- MIME type of link content.
          "rel": [                                      -- Array of link semantic types.
            "player",                                   -- `player` - is widget playing some media.
            "iframely"                                  -- `iframely` - indicates custom code of Iframely:
                                                            in this example, we added responsive `aspect-ratio` and `//` 
          ],
          "title": "BLACK&BLUE",                        -- Usual html link title attribute, equals meta.title.
          "media": {                                    -- "media query" semantics to provide widget media properties.
            "aspect-ratio": 1.778                       -- This means widget is responsive and proportionally resizable.
          }
        },
        ...
      ]
    }


You can use `iframely.js` jQuery script to communicate with Iframely endpoint and render the embeds. 
See `docs` folder for more details on API and `iframely.js`


### Visual Debug Tool

The visusal debug tool is at [http://iframely.com/debug](http://iframely.com/debug). 
Once you deploy Iframely to your own servers, you will have your own copy of technical debug tool at `/debug` address.

You can also get a debugger as [Google Chrome extension here](https://chrome.google.com/webstore/detail/iframely-semantic-url-deb/lhemgegopokbfknihjcefbaamgoojfjf).


### Install & Other Docs

To get a copy of Iframely, you have three options:

* [Download the latest release](https://github.com/itteco/iframely/zipball/master).
* Install via NPM: `npm install iframely`.
* Clone the repo: `git clone git://github.com/itteco/iframely.git`.

Please, see the `docs` folder for more detailed install and configuration instructions as well as API description.


### Sample Apps & Demos

Itteco has developed the following services based on Iframely technology:
* [Nowork FM](http://nowork.fm) - simple intranet for co-working gangs
* [Iframe.ly](http://iframe.ly) - the web shortener

If you'd like your app to be included into the list - please, fork repository and add it to README.md, then submit pull-request.


## Contributing

Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues).

Fork and do a pull-request, if you'de like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you are a publisher and would like to make your embeds available as oEmbed/2 (and thus distributed through iframely) - please, do get in touch or [cast your email here](http://iframely.com).


## Authors

The authors and maintainers of the package are these guys from [Itteco](http://itteco.com):
 - [Nazar Leush](https://github.com/nleush) - _the_ author
 - [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.


