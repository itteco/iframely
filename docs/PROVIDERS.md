# What URLs to send to Iframely

Iframely follows unique approach in determining which providers it supports. Conventional wisdom comes from [oEmbed v1] spec for publishers, which requires them to list the supported URL schemes. Most embed libraries follow in these footsteps.

However, consider this:

 - Iframely supports over [1600 domains](https://iframely.com/domains) out of the box.
 - This doesn't include thousands of custom domains by hosters. For example, Tumblr, WordPress, BrightCove, Wistia and Behance.
 - Plus it doesn't include (quite a lot of) domains that opted to use YouTube and Vimeo as their Twitter card or Open Graph representation.
 - Even the list of 1600+ is not set in stone due to our whitelisting approach. As we do our every-day QA cycle, some domains get added and some get removed.
 - Add thousands news and blogging website that we provider [summary cards](https://iframely.com/docs/widgets) for.
 - Add *any* direct link to image, MP4 videos or PDF files Iframely recognizes and provides embed codes for.


This said, giving your a definite list of providers is quite a challenge. We'd recommend you send us all `/^https?:\/\//i` links you've got and we'll give you the results, if any. 

To give you a peace of mind on this one, there's [API settings](https://iframely.com/settings). You can white-list media types and functional use cases. Also, if you like, API can respond with [error 417](https://iframely.com/docs/result-codes) ("expectation failed") if no HTML embed codes could be generated according to your settings. This way, such URLs won't affect our billing and be ignored.


If you absolutely need one, here's the ever-changing list of 1600+ domains we have in our whitelist: [http://iframe.ly/domains.json](http://iframe.ly/domains.json). Alternatively, you can always have your internal whitelist of the domains that you want to send to us.
