# Iframely Gateway Changelog

This is the history of the [Iframely Gateway](http://iframely.com/gateway) changes. 

Stay tuned, either by watching [Iframely on GitHub](https://github.com/itteco/iframely) or following [Iframely on Twitter](https://twitter.com/iframely).



### 2014.03.04, Version 0.6.0

And, after substantial refactoring, we have a shiny new core! 

Iframely got several times faster response time, increased traffic capacity, and smaller memory footprint. Now, the processing time for cache misses depends solely on latency of the _start_ of a server response from URL's origin host. The technical details of the refactoring follow below. In a nutshell, we've adapted the streaming approach pioneered by [Felix Böhm](https://github.com/fb55) and migrated to libs that are based on this approach. 

Please, run `npm install` to update the package dependencies. 

_Beware_: The interfaces of Iframely core lib have slightly changed and remain unstable as we continue to work on release of Iframely as Node.js lib. The HTTP API endpoints interfaces remained intact.


**Functional changes**:

 * Iframely core lib doesn't have hosted renders of its own any longer. It will produce `html` for the server API to build upon.
 * As a result, the `/oembed` endpoint now has the native `html` of e.g. Twitter, Facebook and Google+ statuses, GitHub gists, Instagram, etc. (as renders were inside the lib, it had hosted wrappers before).
 * We added new functional `rel`  - `app` - so that lib can output native embeds html for statuses, oembed type rich, etc.
 * There is now cache in Iframely's core lib any longer (except for favicons). Response caching has been moved to the API endpoint views.
 * Domain plugin maintenance included necessary fixes. Plus several redundant domain plugins were removed, and some were added, like Behance and Behance hosted sites, Droplr.
* Readability is now called strictly when `og:type` is article (if Readability is allowed in config, of course)


**Details of internal changes in the core lib**:

 * Overall streaming approach for parsers, including migration to `htmlparser2`, `cheerio` and `readabilitySAX`.
 * The plugins architecture is extended to the core params as well. Initial core parameters `meta`, `oembed`, `og`, `twitter`, `cheerio`, `readability` are now returned by system plugins rather than a hardcode.
 * The processing wave for plugins is now strictly asynchronous and supports streaming pipes. A plugin is now called as soon as all the params it depends upon are available.
 * Post processing of the embed links and meta has been moved to system plugins as well, to make it asynchronous too. 


 

### 2014.01.28, Version 0.5.8

Happy 2014! While we work on re-implementing of Iframely's core to make it even faster and more robust, here's the long overdue maintenance release. 

New features:

 + Cluster mode. To run Iframely as cluster - `node cluster`. It is useful for 64bit hardware, and also as a way to manage server's uptime. 
 + Domains DB whitelist file can now be loaded via URL. Set `WHITELIST_URL` in your local config file to your custom access URL, and Iframely will keep loading central whitelist as our QA updates it. Local whitelist files still prevail over loading via URL.

Domain maintenance: 

 + Added Brightcove parser _and_ all hosted players
 + Added PBS.org videos _and_ all hosted sites
 + Custom parser for Vevo (as replacement of the old .fixme one)
 + Support SmugMug galleries
 + Custom parser for Yahoo Screen
 + Custom parser for Imgur's static URLs (#31)
 * Properly fix Imgur's kitten bombs in oEmbed
 + Added Imgur's galleries
 + Parser for Globe And Mail videos
 + Parser for Pando Daily videos
 * Fix Google+ posts by removing unsupported URL schemes
 * Fix Metacafe for their new URL scheme
 * New URL scheme for CollegeHumor pictures
 * Allow YouTube own embeds URLs as input parameter 
 * Changed user-agent string so that all Yahoo sites don't redirect to their mobile versions (thus, blocking all whitelist records)
 * Restore responsiveness of Viddy, Trutv, Revision3
 * Fix for whitelisted Twitter Photo, when there is a fallback to OG image
 * Allow older GitHub gists (the ones without a title and different URL scheme)
 * Fix 9gag photos
 * Cover more URLs on CNN videos, Wistia, Kinja and ec.europa.eu
 * Some performance improvements


### 2013.11.28, Version 0.5.7

This maintenance update is focused on domain plugins. Please remember to update regularly as domains change their websites and we maintain Iframely plugins accordingly. 

 + Finally, a plugin for Vube.com (Alexa rank 69, and they had API issues before)
 + Added plugin for Codepen.io
 + Plugin for Dribbble
 + Screencast (including videos)
 + Tinypic
 + Pastebin
 + About.me
 + Plugins for Haiku Deck & Slid.es (courtesy @peacemoon)
 + Fixes for CNN videos
 + Fixes for BravoTV, Eventbrite, Angellist and Wikimedia
 + By popular demand: Customization of YouTube and Vimeo players. 

To customize YouTube and Vimeo embeds, add your settings to the local config file (which is git-ignored when updating):

        providerOptions: {
          // ...

            // List of query parameters to add to YouTube and Vimeo frames
            // Start it with leading "?". Or omit altogether for default values
            youtube: {
                get_params: "?rel=0&showinfo=1"
                // https://developers.google.com/youtube/player_parameters
            },
            vimeo: {
                get_params: "?byline=0&badge=0"
                // http://developer.vimeo.com/player/embedding
            }
        }


Also, [Iframely Domains DB](http://iframely.com/qa) has recently reached 1500 entries.


### 2013.11.11, Version 0.5.6

Please, run following to update package dependencies:

    rm -r node_modules/iframely-readability
    npm update

 * Fixed JSDOM memory leaks in `iframely-readability` package and when using `$selector` plugin requirement
 * Fixed IE<=9.0 window resize events (#29 - strings instead of JSON in `postMessage`)
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
 * updated TechCrunch plugin to properly parse their new site design
 * fixed and improved AngelList, MyVideo.de, Bravotv
 * changed Twitter regexps to allow processing of statues and photos only (eliminating extra load)
 + added PollDaddy


### 2013.10.02, Version 0.5.3

 + New `/oembed` endpoint, the backwards compatability adapter for [oEmbed v1](http://oembed.com). See [example](http://iframely.com/oembed?url=http://vimeo.com/62092214)


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
 * updated guardian.com plugin domain
 * updated businessinsider.com plugin
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
 * fix instapapper resolving relative urls


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