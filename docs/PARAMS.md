# Optional API call parameters


You may configure API to filter out rich media in [your API settings](https://iframely.com/settings). Or send the same filters in your query-string for each API call individually. If not given with an API call, your defaults will be used. If you haven't set up your preferences, the system-wide settings will be used.


All these parameters are completely optional. If not given, you will still receive all relevant information in `rel` attributes of [Iframely API](https://iframely.com/docs/iframely-api) (not in [oEmbed](https://iframely.com/docs/oembed-api) though).


 - `iframe=true` or `iframe=1` - activates [URL shortener](https://iframely.com/docs/url-shortener) and will return the hosted iframes or [summary cards](https://iframely.com/docs).

 - `autoplay=true` or `1` - will give preference to `autoplay` media and will try to return it as primary `html`. Check for `autoplay` in primary `rel` to verify.

 - `ssl=true` or `1` - will return only embeds that can be used under HTTPs without active SSL mixed-content warnings (images and mp4 videos trigger only passive warnings and thus will pass this check).

 - `html5=true` or `1`- will return only embeds that can be viewed on mobile devices or desktops without Flash plugin installed.

 - `maxwidth=` in pixels will return only embeds that do not exceed this width. It affects the rare cases of fixed-width embeds as in most cases Iframely gives the responsive embed codes. However, this parameter is important for Facebook posts and Pinterest, as it is passed into embed code of those providers to adjust its width.

 - `origin=` - optional tag text value that will help you later search links in your dashboard. It represents the hashtag  E.g. project or chat room name, category, app, if you got several, etc.

 - `callback` - name of a JavaScript function, if you’d like response to be wrapped as JSONP.


Also, for [oEmbed API](https://iframely.com/docs/oembed-api) only:

 - there's `format=xml` parameter - if you'd like to get your oEmbed as XML.

 - But no `autoplay` parameter. oEmbed never returns the media that autoplays. However, If you're wrapping embed codes with [short URL](https://iframely.com/docs/url-shortener) iFrames using API with `iframe=true`, the autoplay media will be returned with a fallback to [summary card](https://iframely.com/docs/widgets).



