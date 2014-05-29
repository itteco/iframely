# Unified META

Most web pages have organic `<meta>` data published using different semantics standards and optimized for different platforms. For example, oEmbed, Open Graph, Twitter Cards, core HTML meta for Google, Dublin Core, Parsely, Sailthru, etc.

Iframely merges various semantics into fields with unified consistent naming keys, so you can reliably use them in your app (if they are available, of course).

Iframely API returns `meta` object that may contain the following fields at the moment:

## General meta

 - `title`
 - `description`
 - `date` (the publication date)
 - `canonical` - canonical URL of the resource 
 - `shortlink` - URL shortened through publisher
 - `category`
 - `keywords`

## Attribution

 - `author`
 - `author_url` 
 - `copyright`
 - `license`
 - `license_url`
 - `site`
 
## Stats

 - `views` - number of views on the original host, e.g. YouTube
 - `likes`
 - `comments`
 - `duration` (in seconds, duration of video or audio content)

## Geo data 

Following Open Graph spec:

 - `country-name`
 - `postal-code` 
 - `street-address`
 - `region`
 - `locality`
 - `latitude`
 - `longitude`

## Product info 

Following Pinterest spec, but also with the parsing of Twitter Cards of product type.

- `price`
- `currency_code`
- `brand`
- `product_id`
- `availability`
- `quantity`