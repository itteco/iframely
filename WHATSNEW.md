# Iframely Gateway Changelog

This is the history of the [Iframely Gateway](http://iframely.com/gateway) changes. 

Stay tuned, either by watching [Iframely on GitHub](https://github.com/itteco/iframely) or following [Iframely on Twitter](https://twitter.com/iframely).

### 2013.11.11, Version 0.5.6

Please, run `npm update` to update package dependencies.

 * Fixed JSDOM memory leaks in `iframely-readability` package and when using `$selector` plugin requirement
 * Fixed IE<=9.0 window resize events (#29 - stings instead of JSON in `postMessage`)
 + HTTPs support (thanks @fent)
 + Links to files now get properly proxied (see #31). Images and video files now be properly rendered. Javascript is excluded for security reasons.
 + [Domains] Plugins for entire Gawker family (Life Hacker, Gawker, Gizmodo, Jezebel, Deadspin, io9, kotaku, jalopnik)
 * [Domains] Fix Livestream, Twitcam, official.fm, NHL, Angel List and Giphy plugins
 * [Domains] Allow responsive Prezi (no more browser freezes detected)
 - [Domains] Disable Vevo as they don't publish embeds in meta at the moment :\
 + [Domains] Explicit Habrahabr.ru parser (conflicted with Tumblr custom domains)

### 2013.10.30, Version 0.5.5

 * Iframely now has the wildcard whitelist record, which gives you an option to decide upfront which generic parsers to allow. For example, you default to white list open graph videos, but deny Twitter photos. The settings will be overwritten if you have a record for specific domains. 
 * HEADS UP: Please, create a `WHITELIST_WILDCARD` in your local config (or copy from sample config). If this record is absent, Iframely will only allow the parsers from domain plugins and those that have explicit domain record in the domains DB.
 * Fixed that nasty bandwidth leak on high load
 * Improved overall performance by adding Gzip encoding for outgoing traffic (to 3rd party sites that Iframely parses). Improves response times and saves traffic for both you and destination domains. 
 * Decreased server load if Readability parsing is enabled with a better pattern to detect potential articles.
 * Replaced custom code for image size detection with arnaud-lb/imagesize.js lib. Run `npm install` when updating.
 * Fixed Tumblr parsers, and extended it to Tumblr's custom domains.
 - Removed client-side jQuery and Bootstrap from the content of the package.
 * Improve image size loading with 'imagesize' package.

### 2013.10.16, Version 0.5.4

 * improve articles loading time: added caching for Readability library
 * improve api response time: cache each request to Iframely server
 + added oembed reader plugin for proper whitelist record (oembed.link with reader)
 * updated TechCrunch plugin to properly parse their new site disign
 * fixed and improved AngelList, MyVideo.de, Bravotv
 * changed Twitter regexps to allow processing of statues and photos only (eliminating extra load)
 + added PollDaddy

### 2013.10.02, Version 0.5.3

 + New `/oembed` endpoint, the backwards-compatability adapter for [oEmbed v1](http://oembed.com). See [example](http://iframely.com/oembed?url=http://vimeo.com/62092214)

### 2013.09.27, Version 0.5.2

 + added weheartit.com photo plugin
 + added travelchannel.com video player plugin
 + added live.huffingtonpost.com player plugin
 + added allthingsd.com player plugin
 + added [Google+ Posts](https://developers.google.com/+/web/embedded-post/) plugin
 + added support of new url schema for openstreetmap.org (Mathias Panzenböck)
 + added helper functions to iframely.js: easy find links by rel and best fit size
 * fixed matching domain plugins for urls with varying domains like `maps.google.co.uk` and `maps.google.com`
 * fixed pinterest matching regexps
 * fixed smugmug.com photo plugin to work with new url schema
 * instagram plugin now supports [native instagram embeds](http://blog.instagram.com/post/55095847329/introducing-instagram-web-embeds)
 * support international domains for huffingtonpost.com

### 2013.09.17, Version 0.5.1

 * fix encoding issues for non-latin characters

### 2013.09.16, Version 0.5.0

 + Added optional [Iframely Domains DB](http://iframely.com/qa) functionality: 
   - Deny Broken Embeds, 
   - Convert OG Twitter & oEmbed into Responsive players,   
   - Allow whitelisted Twitter Photos
   - Proxy Autoplay and SSL tags from the whitelist
   - Get domains DB file from [http://iframely.com/qa/buy](http://iframely.com/qa/buy) and upload to `whitelist` folder
 * number of miscellaneous fixes to make gateway compliant with [official release of Iframely Protocol](http://iframely.com/oembed2)
 - Removed [Coub](http://coub.com) - they now support Iframely protocol natively 
 + support new IFTTT embeds ([example](http://iframely.com/debug?uri=https%3A%2F%2Fifttt.com%2Frecipes%2F116160))
 * fix parsing alternate oembed links
 * fix telly.com plugin 

### 2013.08.13, Version 0.4.4

 + added tumblr.com meta plugin
 + added tumblr.com photo plugin
 + added tumblr.com video plugin
 + added tumblr.com text plugin
 * fixed animoto.com plugin
 * updated guardian.com plguin domain
 * updated businessinsider.com plguin
 * fixed slideshare.net plugin
 + added huffingtonpost.com plugin

### 2013.08.08, Version 0.4.3

 + added mixbit.com plugin

### 2013.08.06, Version 0.4.2

 + added v.qq.com plugin
 + added angel.co embeds plugin
 + added facebook embeds plugin
 + added pinterest product meta
 * check if favicon exists
 * fix instapaper resolving relative urls

### 2013.07.19, Version 0.4.0

 + added readtapestry.com plugin
 + added whosay.com photo plugin
 + added jsfiddle.net plugin
 + added theoatmeal.com plugin
 + added lolwall.co plugin
 + added openstreetmap.org plugin (Mathias Panzenböck)
 + added marketplace.firefox.com plugin (Mathias Panzenböck)
 * fixed smugmug.com plugin
 + added pinterest.com pin-board widget plugin
 + added pinterest.com user widget plugin
 + added pinterest.com pin widget plugin
 * fixed facebook.video plugin
 * fixed businessinsider.com plugin
 * fixed: iframely selects better media sizes for duplicate http/https links from different plugins, giving priority to the ones that produce responsive widget

### 2013.07.11, Version 0.3.10

 * port to htmlparser2, SAX was buggy (Mathias Panzenböck)
 + added /supported-plugins-re.json endpoint
 + added /twitter endpoint to get only twitter meta
 * fixed timeout on waiting full response
 * fixed iframely-link plugin
 * fixed iframed widgets buggy resizing
 * fixed dynamic reader embedding

### 2013.07.05, Version 0.3.9

 + tindeck.com (Mathias Panzenböck)
 + maps.google.com (Mathias Panzenböck)
 + magnatune.com (Mathias Panzenböck)
 + ocreamix.org (Mathias Panzenböck)

### 2013.06.28, Version 0.3.8

 + trutv.com
 + video.nhl.com
 + cnn.com videos
 + issuu.com
 + imgur.com galleries
 + guardian.co.uk videos
 + wikimedia articles and pictures
 + parse links by iframely (oEmbed/2) spec

### 2013.06.27, Version 0.3.7

 + added instagram video
 + 'iframely-widget' styles used by iframely.js to identify generated widgets
 + crowdranking oembed/1 provider added (Mathias Panzenböck)




(c) 2013 [Itteco Software Corp](http://itteco.com). Licensed under MIT. [Get it on Github](https://github.com/itteco/iframely)