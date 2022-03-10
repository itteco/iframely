# Iframely API for Responsive Web Embeds and URL Meta

This is the self-hosted version of [Iframely](https://iframely.com)'s APIs and HTML parsers. 

Iframely takes your URL and returns its metadata. If supported on the URL, we'll add HTML of rich media embeds. Think layers, posts, slideshows, surveys, infographics, maps and more.

This package includes specific domain parsers for most popular publishers. YouTube, Facebook, Instagram, Twitter, SoundCloud, Google Maps, TED, Twitch and many more. See `/plugins/domains` folder. In addition, we cover many domains by whitelisting media thought the generic publishing protocols: [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards) and microformats. For the rest of URLs, you'll include have metadata and thumbnail images from those protocols. Use it to create your own URL previews.

Iframely's [whitelist file](https://iframely.com/qa/whitelist.json) is fetched from our central database. The changes are synced automatically to your instance by default. But you replace that with [your own whitelist](https://iframely.com/docs/whitelist-format) file. There should be over 1500 domains covered by the central whitelist. 

## Breaking changes in version 2.0.0

The minimum version of the Node required for Iframely starting from version 2.0.0 is Node 12. Please see [migration steps](https://github.com/itteco/iframely/issues/350) from earlier versions.

## API endpoints

To make use of the data, you need to connect to APIs over HTTP. There are two endpoints available. One in [oEmbed](https://iframely.com/docs/oembed-api) and one in [Iframely API](https://iframely.com/docs/iframely-api) format. The oEmbed endpoint is just an adapter from Iframely to oEmbed spec. 

Iframely format mimics the `<head>` section of the page. It has `meta` field for data and `links` array for media. 

Both endpoints accept `&url=` input and provide JSON response. Below are some open responses from our [cloud API](https://iframely.com), so you can see the format:

- [>> Iframely API call for Coub video](https://iframe.ly/ACcM3Y.json)
- [>> Same one, but as oEmbed](https://iframe.ly/ACcM3Y.oembed)

You can use Iframely can as Node.js library. That's how we use it in the cloud. However, documentation on it [is lacking](https://github.com/itteco/iframely/issues/186).

## Not included as compared to Cloud API

Hosted [cloud APIs](https://iframely.com) can optionally return Iframely.com-powered iFrame renders in the `html` field. iFrames deliver all hosted widgets such as cards for URL previews, GIF support, player events, AMP, and others. Our [per-URL customization](https://iframely.com/docs/options), predictive sizing mechanism for JavaScript-based embeds to minimize the layout shift, lazy-loading, type-based media whitelist and the number of other configurations are only available in the cloud. 

This open-source version provides the web parsers only. Iframely cloud use data from those parsers as-is in production. Though the format of API endpoints between the cloud and self-hosted version should match, there might be minor discrepancies.

Finally, there's a number of domain plugins not included in self-hosted version. We seem to have stopped adding new publishers to the open-source. It looks like many of our later providers need quicker turnaround time for updates and fixes. You can extend the self-hosted version with private plugins too.


## Get started:

To get started with the APIs: 

 - Your API endpoints will be at `{your.server}/iframely?url=` and `{your.server}/oembed?url=`
 - [How to install & configure](https://iframely.com/docs/host) your Iframely host.  
 - [API in Iframely format](https://iframely.com/docs/iframely-api)
 - [API in oEmbed format](https://iframely.com/docs/oembed-api)
 - [About Link Rels, Types and Media Queries](https://iframely.com/docs/links) in Iframely format (players, thumbnails, app, reader, survey, slideshow, etc)
 - [META semantics](https://iframely.com/docs/meta) Iframely API scrapes for you.
 - Visual debug tool included in the package is at `{your.server}/debug`


## Contribute

We put our best effort to maintain Iframely and all its domain parsers. Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues) if you have any suggestions. Our support email is support at iframely.com

Fork and pull-request, if you'd like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.

Please submit your PR against `develop` branch. This is where everything gets merged before we release it into `master`.


## License & Authors

MIT License. (c) 2012-2022 Itteco Software Corp. [Nazar Leush](https://github.com/nleush), [Ivan Paramonau](https://twitter.com/iparamonau) and the [contributors](https://github.com/itteco/iframely/graphs/contributors).

## Important Links

- [Pipeline](https://app.circleci.com/pipelines/github/blackbaud-services/iframely)
- [API Gateway](https://us-east-1.console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/tmc9fp38w6/resources)
- [Lambda](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/iframelyProd-iframelyProd-1CNBJQIOZ30IT)
