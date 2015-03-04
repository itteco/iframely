# How to block Iframely API

If you are a content publisher, and do not wish your embeds be available via Iframely open-source or Cloud API (as unreasonable as it sounds), you can block us on your proxy. 

Iframely APIs use the following user agent:

	Iframely/0.7.3 (+http://iframely.com/;)

where `0.7.3` is the version of the API, and changes every month. Also, users of Iframely’s open-source package may configure the user-agent to be anything else. 


Unfortunatelly, Iframely can not follow `robots` directives on your pages (`<meta name="robots" content="noindex, ...">`). We tried to test this approach one way or another only to discovered that tremendous number of rich media providers have it mis-configured on their pages. We therefore can not implement a predicatble logic that relies on these directives.