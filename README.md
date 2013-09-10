# Iframely Embeds Gateway

[![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

Iframely Gateway is powerful self-hosted endpoint, simple API for responsive embed widgets and meta.

It returns JSON object with all parsed embed and semantic meta data for the requested URL. 

You host the APIs on your own servers and domain. The primary endpoint is (see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):

  http://{YOURHOST.HERE}/iframely?uri={url encoded http link to a web page}


Iframely provides out-of-the-box:

 - Generic parsers of [Iframely Protocol](http://iframely.com/oembed2), [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and optional Readability articles
 - More than __100 parsers__ for specific domains, like YouTube, Vimeo, Soundcloud, Instagram, etc.
 - Plugins arсhitecture to extend the logic or to implement additional domain or generic parsers
 - Caching for performance optimizations (Memached, Redis or in-memory engines)
 - API for unified/merged meta semantics, thumbnails (incl sizes), video, players, articles


Iframely API response mimics the [Iframely Protocol For Responsive Embeds](http://iframely.com/oembed2), plus merges various meta fields into a list that you could rely on in your code.

Iframely is Node.JS app (and/or package), but you can use it from other environments via API.


(c) 2013 [Itteco Software Corp](http://itteco.com). Licensed under MIT.



## Get Started

You might wish to read [Iframely Protocol](http://iframely.com/oembed2) spec to get a better intro into structure of the API responses and overall concept for responsive embeds.

The custom domain plugins (all 100+ of them) in Iframely gateway, convert those 100+ domains into Iframely Protocol compliant publishers. Iframely gateway acts as the connector with this regard and by the same time is the embeds Consumer app.


### A Picture is Worth a Thousand Words

Please, head to [Iframely Visual Debugger](http://iframely.com/debug) tool to see what Iframely Gateway will be returning. 

Once you [deploy Iframely](http://iframely.com/gateway/setup) to your own servers, you will have your own copy of technical debug tool at `/debug` address.

You can also get a debugger as [Google Chrome extension here](https://chrome.google.com/webstore/detail/iframely-semantic-url-deb/lhemgegopokbfknihjcefbaamgoojfjf).


### Community API Endpoint

__Important__: To jump-start with your dev effort, you may use skip installation and use our [community endpoint](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063) to rapidly develop against it:

    http://iframely.com/iframely?uri={URL encoded URI here}


This endpoint is hosted courtesy of Itteco and has the latest version of Iframely gateway on it. It is subject to restarts and rate-limits and thus _is not suitable for production use_.

Please [deploy Iframely](http://iframely.com/gateway/setup) on your own hardware before going live.


### Understand the API Response

In response to `/iframely?uri=` requests, Iframely will return JSON with the embed links and unified meta semantics.


Response structure is close resemblance of the following analogue of `<head>` part of the URL's page:

    <head>
        <meta name="..." value="..."/>
        <link rel="iframely player" href="..." type="text/html" media="aspect-ratio: 1.778" title="...">
    </head>

JSON response will have the following format:

    {
      "meta": {                                         -- meta object with the unified semantics
        "title": "BLACK&BLUE",                          -- e.g. title attribte and others
        ...
      },
      "links": [                                        -- List of embed widgets
        {
          "href": "//player.vimeo.com/video/67452063",  -- SRC of embed. 
          "type": "text/html",                          -- MIME type of embed method.
          "rel": [                                      -- List of functional use cases. For example,
            "player"                                    -- `player` - is widget with media playback
          ],
          "title": "BLACK&BLUE",                        -- different titles, for different content on the page
          "media": {                                    -- "media query" semantics to indicate responsive sizes
            "aspect-ratio": 1.778                       -- e.g. fluid widget with fixed aspect ratio
          }
        },
        ...
      ]
    }


### Render Embed Widget

You can use included `iframely.js` jQuery library to communicate with Iframely API and to render the embeds. 

It wraps Iframely API and includes responsive trick and best practices mentioned in [Iframely Protocol](http://iframely.com/oembed2/types).

For dev effort, you can source it from `http://iframely.com/r3/js/iframely.js` (again, not production-ready).

[Read more about iframely.js](http://iframely.com/gateway/iframelyjs)


### Deploy to Your Servers Wheneever You're Ready

To get a copy of Iframely, you have three options:

* [Download the latest release](https://github.com/itteco/iframely/zipball/master).
* Install via NPM: `npm install iframely`.
* Clone the repo: `git clone git://github.com/itteco/iframely.git`.

We recommend hosting it on a separate domain for CORS security of your main app.

[Read Setup and Configuration Instructions](http://iframely.com/gateway/setup)


### Get Whitelist File

Itteco provides [Whitelist DB](http://iframely.com/qa), as the first independently run embeds QA service. 

We cover [Iframely Protocol](http://iframely.com/oembed2), oEmbed v1, Twitter Cards and Open Graph in our test runs. 

There are technical/security considerations that can be resolved algorithmically, but it really 
requires a human eye to check if the user experience of the embeds can be relied on. 

The whitelist is a JSON file with the list of domains and `ok` or `reject` tags for each protocol. 

The whitelist support is already included into Gateway. Just upload the latest whitelist file to the root of your Iframely server. See [Setup Instructions](http://iframely.com/gateway/setup).


[Get Whitelist File here](http://iframely.com/qa/buy)


## Sample Apps & Demos

Itteco has developed the following demo services based on Iframely technology:

* [Iframe.ly](http://iframe.ly) - the web shortener
* [Nowork FM](http://nowork.fm) - simple intranet for your team

Feel free to try it to get an inspiration and idea of the possibilities. 



## Be Our Best Friend

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions.

Fork and do a pull-request, if you'de like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

If you are a publisher and would like to make your embeds available under [Iframely Protocol](http://iframely.com/oembed2) (and thus distributed through gateway) - please, [add your domain to the whitelist](http://iframely.com/qa/request).


We encourage you to help other folks get up to speed with Iframely by following community channels:
- Business questions and answers are handled via [Iframely topic on Quora](http://www.quora.com/Iframely)
- Technical Q&A - [iframely tag on StackOverflow](http://stackoverflow.com/questions/tagged/iframely)
- News & Experiences. [#iframely](https://twitter.com/search?q=iframely&src=typd&mode=realtime) or [@iframely](https://twitter.com/iframely) on Twitter


## Authors

The authors and maintainers of the package are these guys from [Itteco](http://itteco.com):

 - [Nazar Leush](https://github.com/nleush) - __the__ author
 - [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts & inspiration

Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.


