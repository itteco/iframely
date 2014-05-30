# How to block Iframely API

If you are a content publisher, and do not wish your embeds be available via Iframely open-source or Cloud API (as weird as it sounds), here’s some information for you. 


Iframely APIs use the following user agent:

	Iframely/0.6.4 (+http://iframely.com/;)

where `0.6.4` is the version of the API, and can change. 

You may opt to block this user agent completely or to allow it to certain sections of your site only. 

Please, note, that users of Iframely’s open-source package may configure the user-agent to be anything else. 

In this case, Iframely still will follow `robots.txt` file directive. As well as `noindex` value of `robots` attribute in page’s meta:

	<meta name="robots" content="noindex">


To give specific directives to Iframely API in your robots config, use `iframely` as robot name. 