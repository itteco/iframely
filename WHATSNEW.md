# Iframely Changelog

This is the history of the Iframely changes. Updates that are older than one year are not shown.

Stay tuned, either by watching [Iframely on GitHub](https://github.com/itteco/iframely) or following [Iframely on Twitter](https://twitter.com/iframely).


### 2015.07.03, Version 0.8.7

- Cleanup and maintenance of domain plugins
- New domains: Datawrapper, Widgetic
- Option to send params for individual oEmbed providers (`ADD_OEMBED_PARAMS` in sample config)
- General config option to group Iframely JSON's links by rel by default (`GROUP_LINKS`)
- `media=1` optional query string API param that will make Iframely try to return actual media. Ex: Instagram MP4 video instead of status embed
- Direct URLs to office docs are now proxied by Google Docs Viewer



### 2015.06.08, Version 0.8.6

Changes to existing publishers:

- Added Imgur’s new `app` embeds
- Support for direct links to Giphy’s gifs
- All Google parsers: properly handle private content and return status 403 if login is required
- Converted Comedy Central plugin to generic  `sm4` parser for MTV Network
- Domain plugins now allow “*” as a mixin. It activates all other generic parsers. Number of domains have been moved to this approach
- Returns players pinned to Pinterest: YouTube, Vimeo, SoundCloud, TED, DailyMotion


New publishers:

- theta360.com
- npr.org (direct links to popup player)
- CNBC videos
- CNN video gallery (videos in articles still processed through whitelist)
- Returned The Onion videos
- Added Google Spreadsheets (thanks @j0k3r)



### 2015.05.07, Version 0.8.5

- Urgent fix for YouTube as they retired v2 API. 
- Set `config.providerOptions.youtube.api_key` with your Google API key to restore all previous features. See sample local config.
- API key is optional: if not given the parsers will fallback to oEmbed data. 
- It may be the same key you have for new Google Maps, yet copy it in other option.


### 2015.05.06, Version 0.8.3


- New Google Maps plugin to support current URL scheme (Google finally stopped re-directing our user-agent to their classic URLs)
- Google Maps require API key: get it [here](https://developers.google.com/maps/documentation/embed/guide#api_key) and configure as `providerOptions.google.maps_key` - see sample local config
- Support of [Camo Proxy](https://github.com/atmos/camo) for all images (thanks guys from Redbooth). See sample config to activate
- Fixes for Spotify and minor fixes for other domains
- Restored domain plugin for The Guardian


### 2015.04.02, Version 0.8.2

- Fixes for some domain plugins like path.com, visual.ly, prezi, deviantart, storify, roomshare.jp
- Twitter statuses can now have variable width (through `&maxwidth` param) and are aligned to center
- New Facebook Video embeds. Yay!
- New plugins for CartoDB, wasu.cn, ku6.com, datpiff.com, tudou.com, deezer



### 2015.03.04, Version 0.8.0

*Heads up:* 

Starting from this version, the minimal Node.js version required for Iframely is 0.10.22. We had to make a choice to either support latest Node.js or earlier version due to incompatible libraries dependenices. Please, run 'npm update' to update libraries. Unfortunatelly, update likely won't work if your Node is earlier than 0.10.22.


- Instagram status JS embeds with rel `app`
- Tumblr status JS embeds with rel `app` (beware: embeds don't work with SSL)
- International domains for Pinterest
- Google custom maps
- YouTube playlists and timed embeds
- Google+ posts for international usernames. Plus, properly exclude posts in groups
- Medium stories will now have JS embeds too
- Fix issues with caching of JSONP requests
- Number of fixes in various other plugins


### 2014.12.30, Version 0.7.2

Happy 2015! Iframely domains whitelist is now free and is delivered to every server instance. Over 1600 domains at the moment!

Other changes in this version:

 - New `gifv` rel for players. Following Imgur's footsteps, it is to indicate MP4 videos that represent gifs and need to be shown as looping video. 
 - New `promo` rel, to indicate that embed is attached to the URL. For example, YouTube's used by domains in Twitter cards and Open Graph videos will now be returned with a lot more options and with rel `promo`. 
 - The same `promo` approach covers all Brightcove's players used on the domains. 
 - Gfycat is a new embeds provider (with `gifv` player)
 - HBR.org, tudou.com, forgifs.com, Google Drive - also added as new providers
 - As whitelist is available to everyone now, we removed some of domains that are covered all right by generic parsers
 - Whitelist now works for hosted oEmbed domains too. It looks at oEmbed discovery and if no domain record found, adds one by API domain. It coveres, for example, all custom domains of SmugMug, WordPress and Behance.
 - Number of domains have been cleaned up. Pinterest boards, for one. 

 Cheerio library has been updated to a newer version. Please, `npm update`.


 Happy 2015 again! And thanks for all your support in 2014!



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
