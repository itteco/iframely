# Iframely Gateway Changelog

This is the history of the Iframely Gateway changes. Updates that are older than 1 year are not shown.

Stay tuned, either by watching [Iframely on GitHub](https://github.com/itteco/iframely) or following [Iframely on Twitter](https://twitter.com/iframely).


### 2014.11.21, Version 0.7.1

This version contains mostly the cleanup of the domains plugins. Some of the most significant improvements are these:

 - Proper handling of Imgur gifs that they changed recently
 - Gallery embed for Flickr user profile pages
 - Vine plugin uses newly introduced oEmbed endpoint. Processing time is now down to 50-70ms
 - Google Plus posts with vanity URLs are finally supported
 - Google Docs support
 - Handle Tumblr's new 12-digit post IDs
 - New or improved embed codes for C-Span, Reuters, Comedy Central, Rap Genius, Giphy, Real player cloud

The package dependencies updated some libraries. Please, run `npm update` to use newer verisons.

In the other news, we published [oEmbed API](http://oembedapi.com) for the use in open-source projects. Take a look.



### 2014.10.15, Version 0.7.0

**API Params.**

This release introduces filtering parameters both in [oEmbed API](https://iframely.com/docs/oembed-api) and [Iframely API](https://iframely.com/docs/iframely-api) formats. 

The optional parameters in API calls are:

- `autoplay=true` or `1` - will give preference to `autoplay` media and will try to return it as primary `html`. Check for `autoplay` in primary `rel` to verify.
 - `ssl=true` or `1` - will return only embeds that can be used under HTTPs without active SSL mixed-content warnings (images and mp4 videos trigger only passive warnings and thus will be passed)
 - `html5=true` or `1`- will return only embeds that can be viewed on mobile devices or desktops without Flash plugin installed
 - `maxwidth=` in pixels will return only embeds that do not exceed the desired width

**API Format changes** 

The [Iframely API](https://iframely.com/docs/iframely-api) response has number of improvements.

- We added a root level `html` and `rel` fields that include embed data from most appropriate link according to your filtering params. 
- For each embed link, we also added a field `html` with the generated HTML code to simplify server-server integrations (so that [iframely.js](https://iframely.com/docs/iframelyjs) isn’t required). This does not include image MIME type.
-  Supplementary rel `ssl` is now included for all links that are SSL-proof. 

These changes should be backwards-compatible. Report any compatibility issues you encounter on [GitHub](https://github.com/itteco/iframely).

**Other improvements**

- As usual, number of domain maintenance, including autoplay variants for YouTube, Vimeo, SoundCloud and Wistia
- Facebook posts and Pinterest embeds can now be adjusted based on your `max-width` value
- Added some domains, such as IMDB, Break.com, Zing.vn, Stitcher podcasts, Prostopleer
- PDF documents embeds via Google Docs Viewer
- Embed codes for Flash now go with `<embed>` html. To make this accurate, Flash and text/html links are double-checked for MIME-type. This involves additional HTTP request for the URL parsers and adds a little time to processing. 



### 2014.08.14, Version 0.6.6 

Maintenance version with number of small fixes and improvements in domain parsers and better parser for pages with several Open Graph videos.


### 2014.07.08, Version 0.6.5

Domains added:

 + podbean.com
 + slide.ly
 + clip.vn
 + squareup.com
 + quizlet.com
 + video.nationalgeographic.com
 + channel9.msdn.com/Events
 + c-span.org
 + indiegogo.com
 + rapgenius.com
 + vgtv.no
 + sverigesradio.se
 + medium.com
 + mixlr.com
 + twitch.tv
 + arte.tv


Domains maintenance:

 * Fixed 9gag.com to find nice source image - big image or animated gif
 * Fixed pinterest.com to prevent working on non-content urls
 * Fixed thumbnail for speakerdeck.com
 * Added video embed for smugmug.com
 + Added html5 tag to text/html players domains that support it


General improvements:

 + Added smart cache invalidation for iframely data per domain and plugin. Now plugin results cache will be invalidated after plugin file update or whitelist domain record update.
 * Better support for open graph arrays
 * Added support of grouped links in iframely.js
 * Improved serverside oembed html attribute generation
 + Added meta plugin to detect page media (e.g. 'player', 'reader')
 * Fix detecting correct charset when response headers charset not equals to html meta tag charset. Response header has priority now.
 + Updated iconv-lite to support more encodings. Please, run `npm update`.
 + Return 403 for non indexing content, according to [How to block Iframely API](http://iframely.com/docs/block-iframely).


### 2014.05.29, Version 0.6.4

This is a domains maintenance release.


Domains added:

 + Beatport.com
 + Time.com
 + Imageshack.com
 + Brainquote.com
 + SportsYapper.com


Fixes:

 * Faster Spotify w/ native oEmbed. Plus responsive
 * Better support for Getty's international URL schemes
 * Proper (non-) inline tag for Storify. Plus slideshow variant
 * Fixes for Mail.ru's new URL scheme
 * Fixed number of plugins with update to latest Cheerio version. Please, run `npm update`.
 * Exclude `/jobs` slug for AngelList
 * Fixed Keek
 * Support vid.ly cdn urls
 * Removed plugins for Gogoyako (RIP) and Lolwall (no more `/lol/`)
 * Openstreetmap is actually fairly responsive


General improvements: 

 + Custom parser for Schema.org's VideoObject (`embedURL`). It is backed by [our whitelist](http://iframely.com/qa)
 + Better handling of multiple `og:video`s on the page
 * Better precision for `aspect-ratio`. We had 1px black stripes on widescreen videos on bigger monitors.



### 2014.05.15, Version 0.6.3


Big ones:

 + added Twitter Stream parser (mp4 videos). It is now in whitelist also. [Get your domains whitelist here](http://iframely.com/qa).
 * re-enable proper domain plugins for Pinterest (proper titles, thumbnails, etc)


Domains maintenance: 

 * Fixed Vube (they switched to iFrames. Yay.)
 * White-list and properly handle all YouTube players in Twitter Cards
 * Proper thumnnails for Tumblr articles
 * Instagram videos no longer mistakenly return `rel=image`
 * Switched to better (and more responsive) embeds for Vine
 * Fixed Behance to support their new URL scheme
 * Fixes for other domains plugins: Dribbble, Telly, Fiddler
 * Handle more URLs for: Flickr (including videos and smaller images), CodePen, Someecards, Globe and Mail, Guardian
 - Removed plugins: QiK (retired as of April 30) and EventBrite (embeds support is inconsistent)


Tech matters:

 * add received cookie jar to options to prevent some redirect loops
 * better handle whitelist re-loads (at some times, whitelist records were lost in transition)
 * return 415 http code in cases where the charset's encoding is not supported yet




### 2014.04.16, Version 0.6.2


__SOME BIG NEWS__: Iframely is now also available as [hosted cloud API](http://iframe.ly).


Generic changes this build:

* Iframely now properly proxies HTTP error codes, such as 401, 403, 404. If origin host times out, Iframely will return 408. 
* Iframely will also generate 404 on private or removed YouTube videos and on private Facebook posts.
* HTTPS is no longer strict. The HTTPS origins with SSL certificate issues will be tolerated and parsed. For example, some Linux distributions will have GoDaddy as unknown signing authority and such deployments will otherwise not be able to parse such origins.
* `application/xhtml+xml` is now allowed MIME type of the origin URLs. For example, this makes Facebook’s mobile pages work.
* Fixed a bug, where some domain plugins that used `oembed-video-responsive` mixin did not actually work without a whitelist file.
* Direct links to images are now returned with rel `file` instead of `image`. `type` will still be actual MIME type of the file. 
* Changed rel `reader` to `app` for some plugins. For example, Instagram, Facebook, Google+, Twitter are now `app`

oEmbed endpoint:

* Fixes the output of original `html` in oEmbed for non `inline app`.
* Fixes the size without 'px' in oEmbed `html`, which screwed up at least SoundCloud embeds codes in oEmbed endpoint.
* Fix to pre-refactor version and do not return `autoplay` widget as oEmbed video.


Facebook:

* Ignore (403) private Facebook statuses.
* Better (HTML5) embed codes for posts.
* Remove the old `photo` plugin. Now photos are returned as posts only.
* Let FB mobile links to be parsed.

YouTube:

* White-list all hosted YouTube in Open Graph tags.
* Thumbnails with black stripes - no more. Plus `maxresdefault` thumbnail where possible.
* Return 404 when API returns no data (video removed).

New domains:

* 56.com, vk.com, mail.ru
* GettyImages. Yay!
* MIT videos
* ebaumsworld.com

Other domains:

* Fixed TED. (no more oEmbed auto discovery on the pages)
* Support of HaikuDeck's new URL scheme.
* Better titles and descriptions for number of domains.
* HTTPs URLs and API response for Imgur.
* Tweaks for Vevo regexp to allow more URLs.
* Return QZ as `safe_html` for better reader implementation.
* Codepen is now faster as they rolled out support of oEmbed.
* Tumblr: If image/video caption is actually a post, return it as such and reduce title to the first sentence of it.
* Tumblr: re-direct to original video URL if embed code isn't iframe (e.g. for Hulu embeds).
* Exclude hosted YouTube from Metacafe parser (will be handled by generic one).
* slide.es changed domain name to slides.com.
* video.pandodaily.com - no more (switched to YouTube channel).





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





(c) 2013 [Itteco Software Corp](http://itteco.com). Licensed under MIT. [Get it on Github](https://github.com/itteco/iframely)