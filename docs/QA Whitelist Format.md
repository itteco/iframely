# Iframely Whitelist File Format

Iframely parsers relies on the whitelist file to allow rich media embeds via [Iframely Protocol](https://iframely.com/oembed2), oEmbed, Twitter Cards and Open Graph. 
 
The central whitelist is already included with default config of the self-hosted [open-source](https://github.com/itteco/iframely) Iframely. Your Iframely instance will fetch the file updates periodically from our servers.

Here's the up-to-date version of the file [http://iframely.com/qa/whitelist.json](https://iframely.com/qa/whitelist.json).

If you like, you can download it, change and upload into `/whitelist` folder of your Iframely server to replace the default behaviour. Or generate your own file altogether based on the structure defined below.


## Basic file structure

For your own file, its name should contain the timestamp when the whitelist was last updated:

    iframely-2013-08-27-14-18-UTC.json

This way you may upload the new files to your server's directory and update them without restart of the server.

The file itself contains the list of domains, with the protocols the domains support and extra information to craft best user experience:

    {
    	"youtube.com": {
    		date: "1485789423106",
    		og: {
    			video: ["allow", "ssl", "responsive"]
    		},
    		oembed: {
    			video: ["allow", "responsive"]
    		},
    		twitter: {
    			player: ["allow", "ssl", "responsive"]
    		}
    	},

    	"mashable.com": {
    		date: "1485789423106",    		
    		twitter: {
    			photo: "deny",
    			player: ["allow", "ssl", "responsive", "autoplay"]
    		}
    	},

    	"*.nbcsports.com": {
    		date: "1485789423106",    		
    		oembed: {
    			link: ["allow", "reader"]
    		}
    	},

		"iframe.ly": {
    		date: "1485789423106",			
			iframely: {
				reader: "allow",
				player: "allow",
				survey: "allow",
				image: "allow",
				thumbnail: "allow",
				logo: "allow"
			}, 
			twitter: {
				player: "allow",
				photo: "allow"		
			},
			og: {
				video: "allow"
			},
			oembed: {
				video: "allow",
				photo: "allow"
			}
		}
	}


The domain name is given as the top-level key. 

Its value contains an object with keys equal to protocol names and values listing the tags associated with the domain-protocol pair. Type within a protocol is at the bottom of hierarchy, followed by the list of QA results as a list of tags.

If the protocol is not supported by the domain, the value of `domain.protocol` will be `null`. If we did not test the domain yet, `domain` will be `null`. If domain does not support specific type on the protocol, then `domain.protocol.type` will be null.

The basic and most important values in tags list are:
 - `"allow"` - means the domain-protocol is whitelisted
 - `"deny"` - indicates that domain-protocol does not provide reliable or expected user experience

`date` value for the domain gives the date when this domain was last updated with the test results. The format is the number of milliseconds since 1970/01/01. You may opt to ignore test results that are not recent enough for your needs. 


## Choosing proper domain object

The domain names are given as the top-level keys for the convenience of quering the values. 

However, whitelist supports wildcard entries, such as `"*.sub.domain.com"` and you would need to choose a proper key. 

We suggest the following algorithm. Let's say you have the URL `http://name.sub.domain.com/slug`:

 1. Check if `name.sub.domain.com` exists. If it does, use as value. 
 2. Check if `*.sub.domain.com` exists. If it does, use as value.
 3. Check if `*.domain.com` exists. If it does, use the value (otherwise - we don't have info about the domain).

The domains use variety of URL structures, and sometimes we need to allow the top domain, but block some of the sub-domains, or whitelist all subdomains except only one. The algorithm above covers the logic of how we do it. 

Please, note that `www.domain.com` and `domain.com` are the same in most cases. If you meet URLs with `www` and we do not list it explicitely as `www.domain.com`, check `domain.com` rather than `*.domain.com`. We try to be as careful about `www` as we can, but since it is a manual QA process, human error is always a factor.



## Protocols

Iframely QA team tests the following protocols and types:

 - `iframely` is for Iframely protocol ([see spec](https://iframely.com/oembed2)) types:
  - player
  - reader
  - image 
  - survey  
 - `oembed` is for [oEmbed](http://oembed.com) types:
  - video 
  - photo
  - rich
 - `og` is for Facebook [Open Graph](http://ogp.me) types. However, we only test video type.
 - `twitter` is for [Twitter Cards](https://dev.twitter.com/docs/cards):
  - player
  - photo
 - `html-meta` protocol with `video` type is for QA results on `video_src` meta tag.

Please, note, that Twitter's photo card allows the fallback onto `og:image` if `twitter:image` is not provided. Such cards may be approved by Iframely as well.



## QA result tags: `allow` or `deny`

The basic and most important values in tags list are:
 - `"allow"` - means the domain-protocol is whitelisted
 - `"deny"` - indicates that domain-protocol does not provide reliable or expected user experience

The naming of those tags is analogous to X-FRAME-OPTIONS header. Except you, the consumer, are now the one that needs to allow or deny the widget.

We also give the extra tags that you can programm the user experience upon:


### Additional `responsive` tag

The `responsive` tag is used for videos and players, if fixed width and size are given (or are ommitted all together). You can program to resize the videos and players to bigger sizes, maintaining the `aspect-ratio`. 

You can see it in following protocol-type combinations: `oembed video`, `og video`, `twitter player`, `html-meta video`. 

For `oembed video`, this tag also means that you need to extract the value of attribute `src` of an `<iframe>` within `html` code (and we only assign this tag for oembed html with iframes in it).


### Additional `html5` tag

If the media works on mobile, there should be `html5` flag, which will be proxied in API responses.

### Additional `ssl` tag

If `https` is the transport protocol of frames in embed code, we verify that the SSL certificate is valid and does not generate browser errors on load and does not break the lock of the browser. Passive mixed content browser warnings when the video or audio starts to play may still occur.

For `og video` it also verifies the value of `og:video:secure_url` attribute.


### Additional `autoplay` tag

This tag is present if the media starts to play automatically without the user interection. You may opt to isolate such widgets from a user until she confirms the action. For example, putting a thumbnail with a play botton above it, and replacing it with the player once user initites the playback. 

Most of `og video` implementations come with `autoplay`. 


### Additional `reader` tag

For `oembed link` and `oembed rich` we add tag `reader`, in case the `html` actually contains the complete article. oEmbed spec does not include article types, and so many publishers (WordPress in particular) provider `link` and `rich` types instead.

